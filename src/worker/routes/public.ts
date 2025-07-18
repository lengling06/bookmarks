import { Hono } from 'hono'
import { eq, desc, like, or, sql, and } from 'drizzle-orm'
import { categories, bookmarks } from '../../db/schema'
import { validateSearchParams } from '../../utils/validation'
import { parseTags, getPaginationOffset, getTotalPages } from '../../utils/database'
import { successResponse, CommonErrors, paginatedResponse } from '../utils/response'
import type { Env } from '../index'

export const publicRoutes = new Hono<{ Bindings: Env }>()

// 获取所有分类（只显示有活跃书签的分类）
publicRoutes.get('/categories', async (c) => {
    try {
        const db = c.get('db')

        // 获取分类及其活跃书签数量
        const result = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                sortOrder: categories.sortOrder,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt,
                bookmarkCount: sql<number>`count(case when ${bookmarks.isActive} = 1 and ${bookmarks.status} = 'active' then 1 end)`
            })
            .from(categories)
            .leftJoin(bookmarks, eq(categories.id, bookmarks.categoryId))
            .groupBy(categories.id)
            .orderBy(categories.sortOrder, categories.name)

        // 只返回有书签的分类
        const categoriesWithBookmarks = result.filter(cat => cat.bookmarkCount > 0)

        return c.json(successResponse(categoriesWithBookmarks))
    } catch (error) {
        console.error('Error fetching categories:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch categories'), 500)
    }
})

// 获取分类下的活跃书签
publicRoutes.get('/categories/:id/bookmarks', async (c) => {
    try {
        const categoryId = parseInt(c.req.param('id'))
        const page = parseInt(c.req.query('page') || '1')
        const limit = parseInt(c.req.query('limit') || '100') // 增加默认限制到100

        // 验证参数
        const validation = validateSearchParams({ page, limit })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        if (isNaN(categoryId) || categoryId <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid category ID'), 400)
        }

        const db = c.get('db')

        // 如果请求所有书签（limit设置为-1或很大的数），则不分页
        let bookmarkList, total;

        if (limit >= 1000) {
            // 获取所有活跃书签
            bookmarkList = await db
                .select({
                    id: bookmarks.id,
                    title: bookmarks.title,
                    url: bookmarks.url,
                    description: bookmarks.description,
                    categoryId: bookmarks.categoryId,
                    tags: bookmarks.tags,
                    createdAt: bookmarks.createdAt,
                    updatedAt: bookmarks.updatedAt
                })
                .from(bookmarks)
                .where(
                    and(
                        eq(bookmarks.categoryId, categoryId),
                        eq(bookmarks.isActive, true),
                        eq(bookmarks.status, 'active')
                    )
                )
                .orderBy(desc(bookmarks.createdAt))

            total = bookmarkList.length;
        } else {
            // 正常分页
            const offset = getPaginationOffset(page, limit)

            bookmarkList = await db
                .select({
                    id: bookmarks.id,
                    title: bookmarks.title,
                    url: bookmarks.url,
                    description: bookmarks.description,
                    categoryId: bookmarks.categoryId,
                    tags: bookmarks.tags,
                    createdAt: bookmarks.createdAt,
                    updatedAt: bookmarks.updatedAt
                })
                .from(bookmarks)
                .where(
                    and(
                        eq(bookmarks.categoryId, categoryId),
                        eq(bookmarks.isActive, true),
                        eq(bookmarks.status, 'active')
                    )
                )
                .orderBy(desc(bookmarks.createdAt))
                .limit(limit)
                .offset(offset)

            // 获取总数
            const totalResult = await db
                .select({ count: sql<number>`count(*)` })
                .from(bookmarks)
                .where(
                    and(
                        eq(bookmarks.categoryId, categoryId),
                        eq(bookmarks.isActive, true),
                        eq(bookmarks.status, 'active')
                    )
                )
            total = totalResult[0]?.count || 0
        }

        const totalPages = getTotalPages(total, limit)

        // 处理书签数据
        const processedBookmarks = bookmarkList.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            categoryId: bookmark.categoryId,
            tags: parseTags(bookmark.tags),
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt
        }))

        return c.json(successResponse({
            bookmarks: processedBookmarks,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }))
    } catch (error) {
        console.error('Error fetching bookmarks:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch bookmarks'), 500)
    }
})

// 搜索活跃书签
publicRoutes.get('/search', async (c) => {
    try {
        const query = c.req.query('q') || ''
        const page = parseInt(c.req.query('page') || '1')
        const limit = parseInt(c.req.query('limit') || '20')

        // 验证参数
        const validation = validateSearchParams({ q: query, page, limit })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        if (!query.trim()) {
            return c.json(successResponse({
                bookmarks: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0
                },
                query: ''
            }))
        }

        const db = c.get('db')
        const offset = getPaginationOffset(page, limit)
        const searchTerm = `%${query.trim()}%`

        // 搜索活跃书签
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
            .where(
                and(
                    eq(bookmarks.isActive, true),
                    eq(bookmarks.status, 'active'),
                    or(
                        like(bookmarks.title, searchTerm),
                        like(bookmarks.description, searchTerm),
                        like(bookmarks.url, searchTerm),
                        like(bookmarks.tags, searchTerm)
                    )
                )
            )
            .orderBy(desc(bookmarks.createdAt))
            .limit(limit)
            .offset(offset)

        // 获取搜索结果总数
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(
                and(
                    eq(bookmarks.isActive, true),
                    eq(bookmarks.status, 'active'),
                    or(
                        like(bookmarks.title, searchTerm),
                        like(bookmarks.description, searchTerm),
                        like(bookmarks.url, searchTerm),
                        like(bookmarks.tags, searchTerm)
                    )
                )
            )

        const total = totalResult[0]?.count || 0
        const totalPages = getTotalPages(total, limit)

        // 处理搜索结果
        const processedBookmarks = bookmarkList.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            categoryId: bookmark.categoryId,
            tags: parseTags(bookmark.tags),
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt,
            category: bookmark.categoryName ? {
                id: bookmark.categoryId,
                name: bookmark.categoryName
            } : undefined
        }))

        return c.json(successResponse({
            bookmarks: processedBookmarks,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            query: query.trim()
        }))
    } catch (error) {
        console.error('Error searching bookmarks:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to search bookmarks'), 500)
    }
})

// 获取分类信息（包含书签数量）
publicRoutes.get('/categories/:id', async (c) => {
    try {
        const categoryId = parseInt(c.req.param('id'))

        if (isNaN(categoryId) || categoryId <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid category ID'), 400)
        }

        const db = c.get('db')

        // 获取分类信息和书签数量
        const result = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                sortOrder: categories.sortOrder,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt,
                bookmarkCount: sql<number>`count(case when ${bookmarks.isActive} = 1 and ${bookmarks.status} = 'active' then 1 end)`
            })
            .from(categories)
            .leftJoin(bookmarks, eq(categories.id, bookmarks.categoryId))
            .where(eq(categories.id, categoryId))
            .groupBy(categories.id)
            .limit(1)

        if (result.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Category'), 404)
        }

        return c.json(successResponse(result[0]))
    } catch (error) {
        console.error('Error fetching category:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch category'), 500)
    }
})

// 获取热门标签
publicRoutes.get('/tags/popular', async (c) => {
    try {
        const limit = parseInt(c.req.query('limit') || '20')

        if (limit < 1 || limit > 100) {
            return c.json(CommonErrors.INVALID_REQUEST('Limit must be between 1 and 100'), 400)
        }

        const db = c.get('db')

        // 获取所有活跃书签的标签
        const bookmarkTags = await db
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

        bookmarkTags.forEach(bookmark => {
            const tags = parseTags(bookmark.tags)
            tags.forEach(tag => {
                const normalizedTag = tag.toLowerCase().trim()
                if (normalizedTag) {
                    tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1
                }
            })
        })

        // 排序并限制数量
        const popularTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([tag, count]) => ({ tag, count }))

        return c.json(successResponse(popularTags))
    } catch (error) {
        console.error('Error fetching popular tags:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch popular tags'), 500)
    }
})

// 根据标签搜索书签
publicRoutes.get('/tags/:tag/bookmarks', async (c) => {
    try {
        const tag = c.req.param('tag')
        const page = parseInt(c.req.query('page') || '1')
        const limit = parseInt(c.req.query('limit') || '20')

        // 验证参数
        const validation = validateSearchParams({ page, limit })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        if (!tag || tag.trim().length === 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Tag cannot be empty'), 400)
        }

        const db = c.get('db')
        const offset = getPaginationOffset(page, limit)
        const searchTag = `%"${tag.toLowerCase().trim()}"%`

        // 搜索包含指定标签的活跃书签
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
            .where(
                and(
                    eq(bookmarks.isActive, true),
                    eq(bookmarks.status, 'active'),
                    like(sql`lower(${bookmarks.tags})`, searchTag)
                )
            )
            .orderBy(desc(bookmarks.createdAt))
            .limit(limit)
            .offset(offset)

        // 获取总数
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(
                and(
                    eq(bookmarks.isActive, true),
                    eq(bookmarks.status, 'active'),
                    like(sql`lower(${bookmarks.tags})`, searchTag)
                )
            )

        const total = totalResult[0]?.count || 0
        const totalPages = getTotalPages(total, limit)

        // 处理书签数据
        const processedBookmarks = bookmarkList.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            categoryId: bookmark.categoryId,
            tags: parseTags(bookmark.tags),
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt,
            category: bookmark.categoryName ? {
                id: bookmark.categoryId,
                name: bookmark.categoryName
            } : undefined
        }))

        return c.json(successResponse({
            bookmarks: processedBookmarks,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            tag: tag.trim()
        }))
    } catch (error) {
        console.error('Error fetching bookmarks by tag:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch bookmarks by tag'), 500)
    }
})