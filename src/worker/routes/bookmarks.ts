import { Hono } from 'hono'
import { eq, desc, like, or, sql, and } from 'drizzle-orm'
import { bookmarks, categories } from '../../db/schema'
import { authMiddleware } from '../middleware/auth'
import { validateBookmark, validateSearchParams } from '../../utils/validation'
import { parseTags, stringifyTags, getPaginationOffset, getTotalPages, normalizeUrl } from '../../utils/database'
import { successResponse, CommonErrors, paginatedResponse } from '../utils/response'
import type { Env } from '../index'

export const bookmarkRoutes = new Hono<{ Bindings: Env }>()

// 获取所有书签（管理员，支持分页和筛选）
bookmarkRoutes.get('/', authMiddleware, async (c) => {
    try {
        const page = parseInt(c.req.query('page') || '1')
        const limit = parseInt(c.req.query('limit') || '20')
        const categoryId = c.req.query('categoryId')
        const status = c.req.query('status')
        const search = c.req.query('search')

        // 验证参数
        const validation = validateSearchParams({ page, limit })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')
        const offset = getPaginationOffset(page, limit)

        // 构建查询条件
        let whereConditions = []

        if (categoryId) {
            const catId = parseInt(categoryId)
            if (!isNaN(catId) && catId > 0) {
                whereConditions.push(eq(bookmarks.categoryId, catId))
            }
        }

        if (status && ['active', 'inactive', 'error'].includes(status)) {
            whereConditions.push(eq(bookmarks.status, status as any))
        }

        if (search && search.trim()) {
            const searchTerm = `%${search.trim()}%`
            whereConditions.push(
                or(
                    like(bookmarks.title, searchTerm),
                    like(bookmarks.description, searchTerm),
                    like(bookmarks.url, searchTerm),
                    like(bookmarks.tags, searchTerm)
                )
            )
        }

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

        // 获取书签列表
        const bookmarkList = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                description: bookmarks.description,
                categoryId: bookmarks.categoryId,
                tags: bookmarks.tags,
                isActive: bookmarks.isActive,
                lastChecked: bookmarks.lastChecked,
                status: bookmarks.status,
                createdAt: bookmarks.createdAt,
                updatedAt: bookmarks.updatedAt,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(whereClause)
            .orderBy(desc(bookmarks.createdAt))
            .limit(limit)
            .offset(offset)

        // 获取总数
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(whereClause)

        const total = totalResult[0]?.count || 0
        const totalPages = getTotalPages(total, limit)

        // 处理书签数据
        const processedBookmarks = bookmarkList.map(bookmark => ({
            ...bookmark,
            tags: parseTags(bookmark.tags),
            category: bookmark.categoryName ? {
                id: bookmark.categoryId,
                name: bookmark.categoryName
            } : undefined
        }))

        return c.json(paginatedResponse(processedBookmarks, page, limit, total, totalPages))
    } catch (error) {
        console.error('Error fetching bookmarks:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch bookmarks'), 500)
    }
})

// 创建书签
bookmarkRoutes.post('/', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { title, url, description, categoryId, tags } = body

        // 验证输入
        const validation = validateBookmark({ title, url, description, categoryId, tags })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')

        // 检查分类是否存在
        const category = await db
            .select()
            .from(categories)
            .where(eq(categories.id, categoryId))
            .limit(1)

        if (category.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Category'), 404)
        }

        // 标准化URL
        const normalizedUrl = normalizeUrl(url.trim())

        // 检查URL是否已存在
        const existingBookmark = await db
            .select()
            .from(bookmarks)
            .where(eq(bookmarks.url, normalizedUrl))
            .limit(1)

        if (existingBookmark.length > 0) {
            return c.json(CommonErrors.DUPLICATE_RESOURCE('Bookmark URL'), 400)
        }

        // 创建书签
        const result = await db
            .insert(bookmarks)
            .values({
                title: title.trim(),
                url: normalizedUrl,
                description: description?.trim() || null,
                categoryId,
                tags: tags && tags.length > 0 ? stringifyTags(tags) : null,
                isActive: true,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .returning()

        // 返回包含分类信息的书签
        const bookmarkWithCategory = {
            ...result[0],
            tags: parseTags(result[0].tags),
            category: {
                id: category[0].id,
                name: category[0].name
            }
        }

        return c.json(successResponse(bookmarkWithCategory), 201)
    } catch (error) {
        console.error('Error creating bookmark:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to create bookmark'), 500)
    }
})

// 获取单个书签
bookmarkRoutes.get('/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'))

        if (isNaN(id) || id <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid bookmark ID'), 400)
        }

        const db = c.get('db')

        const result = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                description: bookmarks.description,
                categoryId: bookmarks.categoryId,
                tags: bookmarks.tags,
                isActive: bookmarks.isActive,
                lastChecked: bookmarks.lastChecked,
                status: bookmarks.status,
                createdAt: bookmarks.createdAt,
                updatedAt: bookmarks.updatedAt,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(eq(bookmarks.id, id))
            .limit(1)

        if (result.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Bookmark'), 404)
        }

        const bookmark = {
            ...result[0],
            tags: parseTags(result[0].tags),
            category: result[0].categoryName ? {
                id: result[0].categoryId,
                name: result[0].categoryName
            } : undefined
        }

        return c.json(successResponse(bookmark))
    } catch (error) {
        console.error('Error fetching bookmark:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch bookmark'), 500)
    }
})

// 更新书签
bookmarkRoutes.put('/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'))
        const body = await c.req.json()
        const { title, url, description, categoryId, tags, isActive, status } = body

        if (isNaN(id) || id <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid bookmark ID'), 400)
        }

        // 验证输入
        const validation = validateBookmark({ title, url, description, categoryId, tags })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')

        // 检查书签是否存在
        const existingBookmark = await db
            .select()
            .from(bookmarks)
            .where(eq(bookmarks.id, id))
            .limit(1)

        if (existingBookmark.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Bookmark'), 404)
        }

        // 检查分类是否存在
        if (categoryId) {
            const category = await db
                .select()
                .from(categories)
                .where(eq(categories.id, categoryId))
                .limit(1)

            if (category.length === 0) {
                return c.json(CommonErrors.NOT_FOUND('Category'), 404)
            }
        }

        // 检查URL是否与其他书签冲突
        if (url && url.trim() !== existingBookmark[0].url) {
            const normalizedUrl = normalizeUrl(url.trim())
            const duplicateBookmark = await db
                .select()
                .from(bookmarks)
                .where(eq(bookmarks.url, normalizedUrl))
                .limit(1)

            if (duplicateBookmark.length > 0) {
                return c.json(CommonErrors.DUPLICATE_RESOURCE('Bookmark URL'), 400)
            }
        }

        // 更新书签
        const updateData: any = {
            updatedAt: new Date().toISOString()
        }

        if (title !== undefined) updateData.title = title.trim()
        if (url !== undefined) updateData.url = normalizeUrl(url.trim())
        if (description !== undefined) updateData.description = description?.trim() || null
        if (categoryId !== undefined) updateData.categoryId = categoryId
        if (tags !== undefined) updateData.tags = tags && tags.length > 0 ? stringifyTags(tags) : null
        if (isActive !== undefined) updateData.isActive = isActive
        if (status !== undefined && ['active', 'inactive', 'error'].includes(status)) {
            updateData.status = status
        }

        const result = await db
            .update(bookmarks)
            .set(updateData)
            .where(eq(bookmarks.id, id))
            .returning()

        // 获取分类信息
        const categoryInfo = await db
            .select({ id: categories.id, name: categories.name })
            .from(categories)
            .where(eq(categories.id, result[0].categoryId))
            .limit(1)

        const bookmarkWithCategory = {
            ...result[0],
            tags: parseTags(result[0].tags),
            category: categoryInfo[0] || undefined
        }

        return c.json(successResponse(bookmarkWithCategory))
    } catch (error) {
        console.error('Error updating bookmark:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to update bookmark'), 500)
    }
})

// 删除书签
bookmarkRoutes.delete('/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'))

        if (isNaN(id) || id <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid bookmark ID'), 400)
        }

        const db = c.get('db')

        // 检查书签是否存在
        const existingBookmark = await db
            .select()
            .from(bookmarks)
            .where(eq(bookmarks.id, id))
            .limit(1)

        if (existingBookmark.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Bookmark'), 404)
        }

        // 删除书签
        await db
            .delete(bookmarks)
            .where(eq(bookmarks.id, id))

        return c.json(successResponse({
            message: 'Bookmark deleted successfully',
            deletedBookmark: {
                id: existingBookmark[0].id,
                title: existingBookmark[0].title,
                url: existingBookmark[0].url
            }
        }))
    } catch (error) {
        console.error('Error deleting bookmark:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to delete bookmark'), 500)
    }
})

// 批量删除书签
bookmarkRoutes.post('/batch-delete', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { bookmarkIds } = body

        if (!Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
            return c.json(CommonErrors.INVALID_REQUEST('bookmarkIds must be a non-empty array'), 400)
        }

        // 验证所有ID都是有效数字
        const validIds = bookmarkIds.filter(id => Number.isInteger(id) && id > 0)
        if (validIds.length !== bookmarkIds.length) {
            return c.json(CommonErrors.INVALID_REQUEST('All bookmark IDs must be positive integers'), 400)
        }

        const db = c.get('db')

        // 检查哪些书签存在
        const existingBookmarks = await db
            .select({ id: bookmarks.id, title: bookmarks.title })
            .from(bookmarks)
            .where(sql`${bookmarks.id} IN (${validIds.join(',')})`)

        if (existingBookmarks.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('No bookmarks found with provided IDs'), 404)
        }

        // 删除书签
        await db
            .delete(bookmarks)
            .where(sql`${bookmarks.id} IN (${validIds.join(',')})`)

        return c.json(successResponse({
            message: 'Bookmarks deleted successfully',
            deletedCount: existingBookmarks.length,
            requestedCount: bookmarkIds.length,
            deletedBookmarks: existingBookmarks
        }))
    } catch (error) {
        console.error('Error batch deleting bookmarks:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to delete bookmarks'), 500)
    }
})

// 批量更新书签状态
bookmarkRoutes.post('/batch-update-status', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { bookmarkIds, status, isActive } = body

        if (!Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
            return c.json(CommonErrors.INVALID_REQUEST('bookmarkIds must be a non-empty array'), 400)
        }

        if (status && !['active', 'inactive', 'error'].includes(status)) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid status value'), 400)
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return c.json(CommonErrors.INVALID_REQUEST('isActive must be a boolean'), 400)
        }

        const validIds = bookmarkIds.filter(id => Number.isInteger(id) && id > 0)
        if (validIds.length !== bookmarkIds.length) {
            return c.json(CommonErrors.INVALID_REQUEST('All bookmark IDs must be positive integers'), 400)
        }

        const db = c.get('db')

        // 构建更新数据
        const updateData: any = {
            updatedAt: new Date().toISOString()
        }

        if (status !== undefined) updateData.status = status
        if (isActive !== undefined) updateData.isActive = isActive

        // 更新书签
        await db
            .update(bookmarks)
            .set(updateData)
            .where(sql`${bookmarks.id} IN (${validIds.join(',')})`)

        return c.json(successResponse({
            message: 'Bookmarks updated successfully',
            updatedCount: validIds.length,
            updates: updateData
        }))
    } catch (error) {
        console.error('Error batch updating bookmarks:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to update bookmarks'), 500)
    }
})