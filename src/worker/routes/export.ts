import { Hono } from 'hono'
import { eq, sql, and, inArray } from 'drizzle-orm'
import { bookmarks, categories } from '../../db/schema'
import { authMiddleware } from '../middleware/auth'
import { successResponse, CommonErrors } from '../utils/response'
import { parseTags } from '../../utils/database'
import {
    exportToHtml,
    exportToJson,
    exportToCsv,
    exportToChromeJson,
    getMimeType,
    generateFileName,
    type ExportBookmark
} from '../utils/export'
import type { Env } from '../index'

export const exportRoutes = new Hono<{ Bindings: Env }>()

// 导出书签
exportRoutes.post('/bookmarks', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const {
            format = 'json',
            categoryIds,
            tags,
            includeInactive = false,
            filename
        } = body

        // 验证格式
        const supportedFormats = ['html', 'json', 'csv', 'chrome-json']
        if (!supportedFormats.includes(format)) {
            return c.json(CommonErrors.INVALID_REQUEST(`Unsupported format. Supported formats: ${supportedFormats.join(', ')}`), 400)
        }

        const db = c.get('db')

        // 构建查询条件
        let whereConditions = []

        // 状态过滤
        if (!includeInactive) {
            whereConditions.push(eq(bookmarks.isActive, true))
            whereConditions.push(eq(bookmarks.status, 'active'))
        }

        // 分类过滤
        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            const validCategoryIds = categoryIds.filter(id => Number.isInteger(id) && id > 0)
            if (validCategoryIds.length > 0) {
                whereConditions.push(inArray(bookmarks.categoryId, validCategoryIds))
            }
        }

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

        // 获取书签数据
        const bookmarkList = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                description: bookmarks.description,
                categoryId: bookmarks.categoryId,
                tags: bookmarks.tags,
                isActive: bookmarks.isActive,
                status: bookmarks.status,
                createdAt: bookmarks.createdAt,
                updatedAt: bookmarks.updatedAt,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(whereClause)
            .orderBy(categories.sortOrder, bookmarks.createdAt)

        if (bookmarkList.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('No bookmarks found matching the criteria'), 404)
        }

        // 处理标签过滤
        let filteredBookmarks = bookmarkList
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const targetTags = tags.map(tag => tag.toLowerCase().trim())
            filteredBookmarks = bookmarkList.filter(bookmark => {
                const bookmarkTags = parseTags(bookmark.tags).map(tag => tag.toLowerCase().trim())
                return targetTags.some(tag => bookmarkTags.includes(tag))
            })
        }

        if (filteredBookmarks.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('No bookmarks found matching the tag criteria'), 404)
        }

        // 转换为导出格式
        const exportBookmarks: ExportBookmark[] = filteredBookmarks.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description || undefined,
            tags: parseTags(bookmark.tags),
            categoryName: bookmark.categoryName || '未分类',
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt
        }))

        // 生成导出内容
        let exportContent: string
        let mimeType: string

        switch (format) {
            case 'html':
                exportContent = exportToHtml(exportBookmarks)
                mimeType = getMimeType('html')
                break
            case 'json':
                exportContent = exportToJson(exportBookmarks)
                mimeType = getMimeType('json')
                break
            case 'csv':
                exportContent = exportToCsv(exportBookmarks)
                mimeType = getMimeType('csv')
                break
            case 'chrome-json':
                exportContent = exportToChromeJson(exportBookmarks)
                mimeType = getMimeType('chrome-json')
                break
            default:
                return c.json(CommonErrors.INVALID_REQUEST('Invalid format'), 400)
        }

        // 生成文件名
        const generatedFilename = filename || generateFileName(format)

        // 返回导出数据
        return c.json(successResponse({
            filename: generatedFilename,
            mimeType,
            content: exportContent,
            size: new Blob([exportContent]).size,
            bookmarkCount: exportBookmarks.length,
            format,
            exportDate: new Date().toISOString()
        }))
    } catch (error) {
        console.error('Export error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to export bookmarks'), 500)
    }
})

// 获取导出统计信息
exportRoutes.get('/stats', authMiddleware, async (c) => {
    try {
        const db = c.get('db')

        // 获取总体统计
        const totalBookmarksResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)

        const activeBookmarksResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(and(eq(bookmarks.isActive, true), eq(bookmarks.status, 'active')))

        const categoriesResult = await db
            .select({
                id: categories.id,
                name: categories.name,
                bookmarkCount: sql<number>`count(${bookmarks.id})`
            })
            .from(categories)
            .leftJoin(bookmarks, eq(categories.id, bookmarks.categoryId))
            .groupBy(categories.id)
            .orderBy(categories.sortOrder)

        // 获取标签统计
        const bookmarkTagsResult = await db
            .select({ tags: bookmarks.tags })
            .from(bookmarks)
            .where(
                and(
                    eq(bookmarks.isActive, true),
                    eq(bookmarks.status, 'active'),
                    sql`${bookmarks.tags} IS NOT NULL AND ${bookmarks.tags} != ''`
                )
            )

        // 统计标签频率
        const tagCounts: { [key: string]: number } = {}
        bookmarkTagsResult.forEach(bookmark => {
            const tags = parseTags(bookmark.tags)
            tags.forEach(tag => {
                const normalizedTag = tag.toLowerCase().trim()
                if (normalizedTag) {
                    tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1
                }
            })
        })

        const popularTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .map(([tag, count]) => ({ tag, count }))

        return c.json(successResponse({
            totalBookmarks: totalBookmarksResult[0]?.count || 0,
            activeBookmarks: activeBookmarksResult[0]?.count || 0,
            categories: categoriesResult,
            popularTags,
            supportedFormats: ['html', 'json', 'csv', 'chrome-json']
        }))
    } catch (error) {
        console.error('Export stats error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch export statistics'), 500)
    }
})

// 预览导出（返回前几个书签的预览）
exportRoutes.post('/preview', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const {
            format = 'json',
            categoryIds,
            tags,
            includeInactive = false,
            limit = 5
        } = body

        // 验证格式
        const supportedFormats = ['html', 'json', 'csv', 'chrome-json']
        if (!supportedFormats.includes(format)) {
            return c.json(CommonErrors.INVALID_REQUEST(`Unsupported format. Supported formats: ${supportedFormats.join(', ')}`), 400)
        }

        const db = c.get('db')

        // 构建查询条件（与导出相同的逻辑）
        let whereConditions = []

        if (!includeInactive) {
            whereConditions.push(eq(bookmarks.isActive, true))
            whereConditions.push(eq(bookmarks.status, 'active'))
        }

        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            const validCategoryIds = categoryIds.filter(id => Number.isInteger(id) && id > 0)
            if (validCategoryIds.length > 0) {
                whereConditions.push(inArray(bookmarks.categoryId, validCategoryIds))
            }
        }

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

        // 获取预览数据
        const bookmarkList = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                description: bookmarks.description,
                categoryId: bookmarks.categoryId,
                tags: bookmarks.tags,
                createdAt: bookmarks.createdAt,
                updatedAt: bookmarks.updatedAt,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(whereClause)
            .orderBy(categories.sortOrder, bookmarks.createdAt)
            .limit(limit)

        // 处理标签过滤
        let filteredBookmarks = bookmarkList
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const targetTags = tags.map(tag => tag.toLowerCase().trim())
            filteredBookmarks = bookmarkList.filter(bookmark => {
                const bookmarkTags = parseTags(bookmark.tags).map(tag => tag.toLowerCase().trim())
                return targetTags.some(tag => bookmarkTags.includes(tag))
            })
        }

        // 转换为导出格式
        const exportBookmarks: ExportBookmark[] = filteredBookmarks.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description || undefined,
            tags: parseTags(bookmark.tags),
            categoryName: bookmark.categoryName || '未分类',
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt
        }))

        // 生成预览内容
        let previewContent: string

        switch (format) {
            case 'html':
                previewContent = exportToHtml(exportBookmarks)
                break
            case 'json':
                previewContent = exportToJson(exportBookmarks)
                break
            case 'csv':
                previewContent = exportToCsv(exportBookmarks)
                break
            case 'chrome-json':
                previewContent = exportToChromeJson(exportBookmarks)
                break
            default:
                return c.json(CommonErrors.INVALID_REQUEST('Invalid format'), 400)
        }

        return c.json(successResponse({
            format,
            previewContent: previewContent.substring(0, 2000), // 限制预览长度
            bookmarkCount: exportBookmarks.length,
            isPreview: true,
            previewLimit: limit
        }))
    } catch (error) {
        console.error('Export preview error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to generate export preview'), 500)
    }
})