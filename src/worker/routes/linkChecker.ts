import { Hono } from 'hono'
import { eq, sql, and, inArray } from 'drizzle-orm'
import { bookmarks, categories } from '../../db/schema'
import { authMiddleware } from '../middleware/auth'
import { successResponse, CommonErrors } from '../utils/response'
import {
    checkSingleLink,
    checkMultipleLinks,
    findDuplicateUrls,
    generateLinkCheckReport,
    isValidUrlFormat,
    type LinkCheckResult
} from '../utils/linkChecker'
import type { Env } from '../index'

export const linkCheckerRoutes = new Hono<{ Bindings: Env }>()

// 检查单个书签链接
linkCheckerRoutes.post('/check/:id', authMiddleware, async (c) => {
    try {
        const bookmarkId = parseInt(c.req.param('id'))

        if (isNaN(bookmarkId) || bookmarkId <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid bookmark ID'), 400)
        }

        const db = c.get('db')

        // 获取书签信息
        const bookmarkResult = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url
            })
            .from(bookmarks)
            .where(eq(bookmarks.id, bookmarkId))
            .limit(1)

        if (bookmarkResult.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Bookmark'), 404)
        }

        const bookmark = bookmarkResult[0]

        // 检查URL格式
        if (!isValidUrlFormat(bookmark.url)) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid URL format'), 400)
        }

        // 执行链接检查
        const result = await checkSingleLink(bookmark.id, bookmark.url)

        // 更新书签状态
        const newStatus = result.status === 'success' ? 'active' : 'error'
        await db
            .update(bookmarks)
            .set({
                status: newStatus,
                lastChecked: result.checkedAt,
                updatedAt: new Date().toISOString()
            })
            .where(eq(bookmarks.id, bookmarkId))

        return c.json(successResponse({
            bookmark: {
                id: bookmark.id,
                title: bookmark.title,
                url: bookmark.url
            },
            checkResult: result,
            updatedStatus: newStatus
        }))
    } catch (error) {
        console.error('Link check error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to check link'), 500)
    }
})

// 批量检查链接
linkCheckerRoutes.post('/check-batch', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const {
            bookmarkIds,
            categoryIds,
            checkAll = false,
            timeout = 10000,
            concurrency = 5
        } = body

        const db = c.get('db')

        // 构建查询条件
        let whereConditions = [eq(bookmarks.isActive, true)]

        if (checkAll) {
            // 检查所有活跃书签
        } else if (bookmarkIds && Array.isArray(bookmarkIds) && bookmarkIds.length > 0) {
            const validIds = bookmarkIds.filter(id => Number.isInteger(id) && id > 0)
            if (validIds.length === 0) {
                return c.json(CommonErrors.INVALID_REQUEST('No valid bookmark IDs provided'), 400)
            }
            whereConditions.push(inArray(bookmarks.id, validIds))
        } else if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            const validCategoryIds = categoryIds.filter(id => Number.isInteger(id) && id > 0)
            if (validCategoryIds.length === 0) {
                return c.json(CommonErrors.INVALID_REQUEST('No valid category IDs provided'), 400)
            }
            whereConditions.push(inArray(bookmarks.categoryId, validCategoryIds))
        } else {
            return c.json(CommonErrors.INVALID_REQUEST('Must specify bookmarkIds, categoryIds, or checkAll=true'), 400)
        }

        // 获取要检查的书签
        const bookmarksToCheck = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url
            })
            .from(bookmarks)
            .where(and(...whereConditions))

        if (bookmarksToCheck.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('No bookmarks found to check'), 404)
        }

        // 过滤无效URL格式的书签
        const validBookmarks = bookmarksToCheck.filter(bookmark => isValidUrlFormat(bookmark.url))
        const invalidUrls = bookmarksToCheck.filter(bookmark => !isValidUrlFormat(bookmark.url))

        if (validBookmarks.length === 0) {
            return c.json(CommonErrors.INVALID_REQUEST('No bookmarks with valid URLs found'), 400)
        }

        // 执行批量检查
        const checkResult = await checkMultipleLinks(
            validBookmarks.map(b => ({ id: b.id, url: b.url })),
            { timeout, concurrency, delay: 100 }
        )

        // 批量更新书签状态
        const updatePromises = checkResult.results.map(result => {
            const newStatus = result.status === 'success' ? 'active' : 'error'
            return db
                .update(bookmarks)
                .set({
                    status: newStatus,
                    lastChecked: result.checkedAt,
                    updatedAt: new Date().toISOString()
                })
                .where(eq(bookmarks.id, result.bookmarkId))
        })

        await Promise.all(updatePromises)

        // 生成报告
        const report = generateLinkCheckReport(checkResult.results)

        return c.json(successResponse({
            summary: {
                totalRequested: bookmarksToCheck.length,
                validUrls: validBookmarks.length,
                invalidUrls: invalidUrls.length,
                ...report.summary
            },
            report,
            invalidUrls: invalidUrls.map(b => ({ id: b.id, title: b.title, url: b.url })),
            checkDate: new Date().toISOString()
        }))
    } catch (error) {
        console.error('Batch link check error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to check links'), 500)
    }
})

// 获取失效链接列表
linkCheckerRoutes.get('/broken-links', authMiddleware, async (c) => {
    try {
        const page = parseInt(c.req.query('page') || '1')
        const limit = parseInt(c.req.query('limit') || '20')
        const categoryId = c.req.query('categoryId')

        const db = c.get('db')

        // 构建查询条件
        let whereConditions = [
            eq(bookmarks.isActive, true),
            eq(bookmarks.status, 'error')
        ]

        if (categoryId) {
            const catId = parseInt(categoryId)
            if (!isNaN(catId) && catId > 0) {
                whereConditions.push(eq(bookmarks.categoryId, catId))
            }
        }

        const offset = (page - 1) * limit

        // 获取失效链接
        const brokenLinks = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                description: bookmarks.description,
                categoryId: bookmarks.categoryId,
                lastChecked: bookmarks.lastChecked,
                createdAt: bookmarks.createdAt,
                updatedAt: bookmarks.updatedAt,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(and(...whereConditions))
            .orderBy(bookmarks.lastChecked)
            .limit(limit)
            .offset(offset)

        // 获取总数
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(and(...whereConditions))

        const total = totalResult[0]?.count || 0
        const totalPages = Math.ceil(total / limit)

        return c.json(successResponse({
            brokenLinks,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }))
    } catch (error) {
        console.error('Error fetching broken links:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch broken links'), 500)
    }
})

// 检测重复书签
linkCheckerRoutes.get('/duplicates', authMiddleware, async (c) => {
    try {
        const db = c.get('db')

        // 获取所有活跃书签
        const allBookmarks = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                categoryId: bookmarks.categoryId,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(eq(bookmarks.isActive, true))

        // 检测重复
        const duplicates = findDuplicateUrls(
            allBookmarks.map(b => ({ id: b.id, url: b.url }))
        )

        // 构建重复书签详情
        const duplicateGroups = []
        for (const [url, bookmarkIds] of duplicates) {
            const duplicateBookmarks = allBookmarks.filter(b => bookmarkIds.includes(b.id))
            duplicateGroups.push({
                url,
                count: bookmarkIds.length,
                bookmarks: duplicateBookmarks
            })
        }

        // 按重复数量排序
        duplicateGroups.sort((a, b) => b.count - a.count)

        return c.json(successResponse({
            totalDuplicateGroups: duplicateGroups.length,
            totalDuplicateBookmarks: duplicateGroups.reduce((sum, group) => sum + group.count, 0),
            duplicateGroups
        }))
    } catch (error) {
        console.error('Error detecting duplicates:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to detect duplicate bookmarks'), 500)
    }
})

// 批量删除失效链接
linkCheckerRoutes.delete('/broken-links', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { bookmarkIds, deleteAll = false } = body

        const db = c.get('db')

        let whereConditions = [
            eq(bookmarks.isActive, true),
            eq(bookmarks.status, 'error')
        ]

        if (deleteAll) {
            // 删除所有失效链接
        } else if (bookmarkIds && Array.isArray(bookmarkIds) && bookmarkIds.length > 0) {
            const validIds = bookmarkIds.filter(id => Number.isInteger(id) && id > 0)
            if (validIds.length === 0) {
                return c.json(CommonErrors.INVALID_REQUEST('No valid bookmark IDs provided'), 400)
            }
            whereConditions.push(inArray(bookmarks.id, validIds))
        } else {
            return c.json(CommonErrors.INVALID_REQUEST('Must specify bookmarkIds or deleteAll=true'), 400)
        }

        // 获取要删除的书签信息
        const bookmarksToDelete = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url
            })
            .from(bookmarks)
            .where(and(...whereConditions))

        if (bookmarksToDelete.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('No broken links found to delete'), 404)
        }

        // 执行删除
        await db
            .delete(bookmarks)
            .where(and(...whereConditions))

        return c.json(successResponse({
            message: 'Broken links deleted successfully',
            deletedCount: bookmarksToDelete.length,
            deletedBookmarks: bookmarksToDelete
        }))
    } catch (error) {
        console.error('Error deleting broken links:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to delete broken links'), 500)
    }
})

// 合并重复书签
linkCheckerRoutes.post('/merge-duplicates', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { duplicateGroups } = body

        if (!Array.isArray(duplicateGroups) || duplicateGroups.length === 0) {
            return c.json(CommonErrors.INVALID_REQUEST('duplicateGroups is required'), 400)
        }

        const db = c.get('db')
        let mergedCount = 0
        let deletedCount = 0

        for (const group of duplicateGroups) {
            const { keepBookmarkId, deleteBookmarkIds } = group

            if (!keepBookmarkId || !Array.isArray(deleteBookmarkIds) || deleteBookmarkIds.length === 0) {
                continue
            }

            // 验证要保留的书签存在
            const keepBookmark = await db
                .select()
                .from(bookmarks)
                .where(eq(bookmarks.id, keepBookmarkId))
                .limit(1)

            if (keepBookmark.length === 0) {
                continue
            }

            // 删除重复的书签
            const validDeleteIds = deleteBookmarkIds.filter(id => Number.isInteger(id) && id > 0)
            if (validDeleteIds.length > 0) {
                await db
                    .delete(bookmarks)
                    .where(inArray(bookmarks.id, validDeleteIds))

                deletedCount += validDeleteIds.length
                mergedCount++
            }
        }

        return c.json(successResponse({
            message: 'Duplicate bookmarks merged successfully',
            mergedGroups: mergedCount,
            deletedBookmarks: deletedCount
        }))
    } catch (error) {
        console.error('Error merging duplicates:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to merge duplicate bookmarks'), 500)
    }
})