import { Hono } from 'hono'
import { eq, sql } from 'drizzle-orm'
import { bookmarks, categories } from '../../db/schema'
import { authMiddleware } from '../middleware/auth'
import { successResponse, CommonErrors } from '../utils/response'
import { stringifyTags } from '../../utils/database'
import {
    parseHtmlBookmarks,
    parseJsonBookmarks,
    detectBookmarkFormat,
    processBatchImport,
    type ImportResult
} from '../utils/import'
import type { Env } from '../index'

export const importRoutes = new Hono<{ Bindings: Env }>()

// 导入书签
importRoutes.post('/bookmarks', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { content, format, skipDuplicates = true, defaultCategoryId } = body

        if (!content || typeof content !== 'string') {
            return c.json(CommonErrors.INVALID_REQUEST('Content is required'), 400)
        }

        // 检测或验证格式
        const detectedFormat = format || detectBookmarkFormat(content)
        if (!['html', 'json'].includes(detectedFormat)) {
            return c.json(CommonErrors.INVALID_REQUEST('Unsupported file format. Only HTML and JSON are supported.'), 400)
        }

        const db = c.get('db')

        // 验证默认分类（如果提供）
        let defaultCategory = null
        if (defaultCategoryId) {
            const categoryResult = await db
                .select()
                .from(categories)
                .where(eq(categories.id, defaultCategoryId))
                .limit(1)

            if (categoryResult.length === 0) {
                return c.json(CommonErrors.NOT_FOUND('Default category'), 404)
            }
            defaultCategory = categoryResult[0]
        }

        // 如果没有默认分类，创建一个"导入"分类
        if (!defaultCategory) {
            // 检查是否已存在"导入"分类
            const importCategoryResult = await db
                .select()
                .from(categories)
                .where(eq(categories.name, '导入'))
                .limit(1)

            if (importCategoryResult.length > 0) {
                defaultCategory = importCategoryResult[0]
            } else {
                // 创建新的导入分类
                const maxSortResult = await db
                    .select({ maxSort: sql<number>`max(${categories.sortOrder})` })
                    .from(categories)

                const newCategoryResult = await db
                    .insert(categories)
                    .values({
                        name: '导入',
                        description: '从外部导入的书签',
                        sortOrder: (maxSortResult[0]?.maxSort || 0) + 1,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    })
                    .returning()

                defaultCategory = newCategoryResult[0]
            }
        }

        // 解析书签
        let parsedBookmarks
        try {
            if (detectedFormat === 'html') {
                parsedBookmarks = parseHtmlBookmarks(content)
            } else {
                parsedBookmarks = parseJsonBookmarks(content)
            }
        } catch (error) {
            console.error('Error parsing bookmarks:', error)
            return c.json(CommonErrors.INVALID_REQUEST('Failed to parse bookmark file'), 400)
        }

        if (parsedBookmarks.length === 0) {
            return c.json(CommonErrors.INVALID_REQUEST('No valid bookmarks found in the file'), 400)
        }

        // 获取现有书签URL以检查重复
        const existingBookmarksResult = await db
            .select({ url: bookmarks.url })
            .from(bookmarks)

        const existingUrls = new Set(existingBookmarksResult.map(b => b.url))

        // 处理批量导入
        const { toImport, duplicates, invalid } = processBatchImport(
            parsedBookmarks,
            existingUrls,
            skipDuplicates
        )

        // 创建分类映射（基于文件夹名称）
        const folderCategoryMap = new Map<string, number>()
        const uniqueFolders = [...new Set(toImport.map(b => b.folder).filter(Boolean))]

        for (const folder of uniqueFolders) {
            if (!folder) continue

            // 检查分类是否已存在
            const existingCategoryResult = await db
                .select()
                .from(categories)
                .where(eq(categories.name, folder))
                .limit(1)

            if (existingCategoryResult.length > 0) {
                folderCategoryMap.set(folder, existingCategoryResult[0].id)
            } else {
                // 创建新分类
                const maxSortResult = await db
                    .select({ maxSort: sql<number>`max(${categories.sortOrder})` })
                    .from(categories)

                const newCategoryResult = await db
                    .insert(categories)
                    .values({
                        name: folder,
                        description: `从导入文件创建的分类：${folder}`,
                        sortOrder: (maxSortResult[0]?.maxSort || 0) + 1,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    })
                    .returning()

                folderCategoryMap.set(folder, newCategoryResult[0].id)
            }
        }

        // 批量插入书签
        const importErrors: string[] = []
        let successCount = 0

        for (const bookmark of toImport) {
            try {
                // 确定分类ID
                const categoryId = bookmark.folder && folderCategoryMap.has(bookmark.folder)
                    ? folderCategoryMap.get(bookmark.folder)!
                    : defaultCategory!.id

                await db.insert(bookmarks).values({
                    title: bookmark.title,
                    url: bookmark.url,
                    description: bookmark.description || null,
                    categoryId,
                    tags: bookmark.tags && bookmark.tags.length > 0 ? stringifyTags(bookmark.tags) : null,
                    isActive: true,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })

                successCount++
            } catch (error) {
                console.error('Error importing bookmark:', error)
                importErrors.push(`Failed to import "${bookmark.title}": ${error}`)
            }
        }

        // 准备结果
        const result: ImportResult = {
            success: successCount,
            failed: toImport.length - successCount,
            skipped: duplicates.length,
            duplicates: duplicates.length,
            errors: [
                ...importErrors,
                ...invalid.map(item => `Invalid bookmark "${item.bookmark.title}": ${item.errors.join(', ')}`)
            ]
        }

        return c.json(successResponse({
            result,
            summary: {
                totalProcessed: parsedBookmarks.length,
                successfullyImported: successCount,
                duplicatesSkipped: duplicates.length,
                invalidBookmarks: invalid.length,
                errors: result.errors.length,
                categoriesCreated: uniqueFolders.length
            }
        }))
    } catch (error) {
        console.error('Import error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to import bookmarks'), 500)
    }
})

// 预览导入（不实际导入，只显示将要导入的内容）
importRoutes.post('/preview', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { content, format } = body

        if (!content || typeof content !== 'string') {
            return c.json(CommonErrors.INVALID_REQUEST('Content is required'), 400)
        }

        // 检测格式
        const detectedFormat = format || detectBookmarkFormat(content)
        if (!['html', 'json'].includes(detectedFormat)) {
            return c.json(CommonErrors.INVALID_REQUEST('Unsupported file format'), 400)
        }

        // 解析书签
        let parsedBookmarks
        try {
            if (detectedFormat === 'html') {
                parsedBookmarks = parseHtmlBookmarks(content)
            } else {
                parsedBookmarks = parseJsonBookmarks(content)
            }
        } catch (error) {
            console.error('Error parsing bookmarks for preview:', error)
            return c.json(CommonErrors.INVALID_REQUEST('Failed to parse bookmark file'), 400)
        }

        const db = c.get('db')

        // 获取现有书签URL
        const existingBookmarksResult = await db
            .select({ url: bookmarks.url })
            .from(bookmarks)

        const existingUrls = new Set(existingBookmarksResult.map(b => b.url))

        // 处理预览
        const { toImport, duplicates, invalid } = processBatchImport(
            parsedBookmarks,
            existingUrls,
            false // 不跳过重复项，用于预览
        )

        // 统计文件夹
        const folders = [...new Set(parsedBookmarks.map(b => b.folder).filter(Boolean))]

        return c.json(successResponse({
            format: detectedFormat,
            totalBookmarks: parsedBookmarks.length,
            validBookmarks: toImport.length,
            duplicateBookmarks: duplicates.length,
            invalidBookmarks: invalid.length,
            folders: folders,
            preview: {
                valid: toImport.slice(0, 10), // 显示前10个有效书签
                duplicates: duplicates.slice(0, 5), // 显示前5个重复书签
                invalid: invalid.slice(0, 5) // 显示前5个无效书签
            }
        }))
    } catch (error) {
        console.error('Preview error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to preview import'), 500)
    }
})

// 获取导入历史（简单实现）
importRoutes.get('/history', authMiddleware, async (c) => {
    try {
        // 这里可以实现导入历史记录功能
        // 目前返回空数组，后续可以添加导入日志表
        return c.json(successResponse([]))
    } catch (error) {
        console.error('Error fetching import history:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch import history'), 500)
    }
})