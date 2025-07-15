import { Hono } from 'hono'
import { eq, desc, sql } from 'drizzle-orm'
import { categories, bookmarks } from '../../db/schema'
import { authMiddleware } from '../middleware/auth'
import { validateCategory } from '../../utils/validation'
import { successResponse, CommonErrors } from '../utils/response'
import type { Env } from '../index'

export const categoryRoutes = new Hono<{ Bindings: Env }>()

// 获取所有分类（管理员）
categoryRoutes.get('/', authMiddleware, async (c) => {
    try {
        const db = c.get('db')

        const result = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                sortOrder: categories.sortOrder,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt,
                bookmarkCount: sql<number>`count(${bookmarks.id})`
            })
            .from(categories)
            .leftJoin(bookmarks, eq(categories.id, bookmarks.categoryId))
            .groupBy(categories.id)
            .orderBy(categories.sortOrder, categories.name)

        return c.json(successResponse(result))
    } catch (error) {
        console.error('Error fetching categories:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch categories'), 500)
    }
})

// 创建分类
categoryRoutes.post('/', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { name, description, sortOrder } = body

        // 验证输入
        const validation = validateCategory({ name, description, sortOrder })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')

        // 检查分类名称是否已存在
        const existingCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.name, name.trim()))
            .limit(1)

        if (existingCategory.length > 0) {
            return c.json(CommonErrors.DUPLICATE_RESOURCE('Category name'), 400)
        }

        // 如果没有指定排序值，使用最大值+1
        let finalSortOrder = sortOrder || 0
        if (!sortOrder) {
            const maxSortResult = await db
                .select({ maxSort: sql<number>`max(${categories.sortOrder})` })
                .from(categories)

            finalSortOrder = (maxSortResult[0]?.maxSort || 0) + 1
        }

        // 创建分类
        const result = await db
            .insert(categories)
            .values({
                name: name.trim(),
                description: description?.trim() || null,
                sortOrder: finalSortOrder,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .returning()

        return c.json(successResponse(result[0]), 201)
    } catch (error) {
        console.error('Error creating category:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to create category'), 500)
    }
})

// 获取单个分类
categoryRoutes.get('/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'))

        if (isNaN(id) || id <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid category ID'), 400)
        }

        const db = c.get('db')

        const result = await db
            .select({
                id: categories.id,
                name: categories.name,
                description: categories.description,
                sortOrder: categories.sortOrder,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt,
                bookmarkCount: sql<number>`count(${bookmarks.id})`
            })
            .from(categories)
            .leftJoin(bookmarks, eq(categories.id, bookmarks.categoryId))
            .where(eq(categories.id, id))
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

// 更新分类
categoryRoutes.put('/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'))
        const body = await c.req.json()
        const { name, description, sortOrder } = body

        if (isNaN(id) || id <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid category ID'), 400)
        }

        // 验证输入
        const validation = validateCategory({ name, description, sortOrder })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')

        // 检查分类是否存在
        const existingCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1)

        if (existingCategory.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Category'), 404)
        }

        // 检查名称是否与其他分类冲突
        if (name && name.trim() !== existingCategory[0].name) {
            const duplicateCategory = await db
                .select()
                .from(categories)
                .where(eq(categories.name, name.trim()))
                .limit(1)

            if (duplicateCategory.length > 0) {
                return c.json(CommonErrors.DUPLICATE_RESOURCE('Category name'), 400)
            }
        }

        // 更新分类
        const updateData: any = {
            updatedAt: new Date().toISOString()
        }

        if (name !== undefined) updateData.name = name.trim()
        if (description !== undefined) updateData.description = description?.trim() || null
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder

        const result = await db
            .update(categories)
            .set(updateData)
            .where(eq(categories.id, id))
            .returning()

        return c.json(successResponse(result[0]))
    } catch (error) {
        console.error('Error updating category:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to update category'), 500)
    }
})

// 删除分类
categoryRoutes.delete('/:id', authMiddleware, async (c) => {
    try {
        const id = parseInt(c.req.param('id'))
        const action = c.req.query('action') || 'move' // 'move' 或 'delete'
        const targetCategoryId = c.req.query('targetCategoryId')

        if (isNaN(id) || id <= 0) {
            return c.json(CommonErrors.INVALID_REQUEST('Invalid category ID'), 400)
        }

        const db = c.get('db')

        // 检查分类是否存在
        const existingCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1)

        if (existingCategory.length === 0) {
            return c.json(CommonErrors.NOT_FOUND('Category'), 404)
        }

        // 检查分类下是否有书签
        const bookmarkCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(eq(bookmarks.categoryId, id))

        const hasBookmarks = bookmarkCount[0]?.count > 0

        if (hasBookmarks) {
            if (action === 'move') {
                // 移动书签到其他分类
                if (!targetCategoryId) {
                    return c.json(CommonErrors.INVALID_REQUEST('Target category ID is required when moving bookmarks'), 400)
                }

                const targetId = parseInt(targetCategoryId)
                if (isNaN(targetId) || targetId <= 0) {
                    return c.json(CommonErrors.INVALID_REQUEST('Invalid target category ID'), 400)
                }

                // 检查目标分类是否存在
                const targetCategory = await db
                    .select()
                    .from(categories)
                    .where(eq(categories.id, targetId))
                    .limit(1)

                if (targetCategory.length === 0) {
                    return c.json(CommonErrors.NOT_FOUND('Target category'), 404)
                }

                // 移动书签
                await db
                    .update(bookmarks)
                    .set({
                        categoryId: targetId,
                        updatedAt: new Date().toISOString()
                    })
                    .where(eq(bookmarks.categoryId, id))
            } else if (action === 'delete') {
                // 删除所有书签
                await db
                    .delete(bookmarks)
                    .where(eq(bookmarks.categoryId, id))
            } else {
                return c.json(CommonErrors.INVALID_REQUEST('Invalid action. Use "move" or "delete"'), 400)
            }
        }

        // 删除分类
        await db
            .delete(categories)
            .where(eq(categories.id, id))

        return c.json(successResponse({
            message: 'Category deleted successfully',
            bookmarksAffected: hasBookmarks ? bookmarkCount[0].count : 0,
            action: hasBookmarks ? action : 'none'
        }))
    } catch (error) {
        console.error('Error deleting category:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to delete category'), 500)
    }
})

// 批量更新分类排序
categoryRoutes.post('/reorder', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { categoryOrders } = body

        if (!Array.isArray(categoryOrders)) {
            return c.json(CommonErrors.INVALID_REQUEST('categoryOrders must be an array'), 400)
        }

        const db = c.get('db')

        // 验证所有分类ID是否存在
        const categoryIds = categoryOrders.map(item => item.id)
        const existingCategories = await db
            .select({ id: categories.id })
            .from(categories)
            .where(sql`${categories.id} IN (${categoryIds.join(',')})`)

        if (existingCategories.length !== categoryIds.length) {
            return c.json(CommonErrors.INVALID_REQUEST('Some category IDs do not exist'), 400)
        }

        // 批量更新排序
        const updatePromises = categoryOrders.map(({ id, sortOrder }) =>
            db
                .update(categories)
                .set({
                    sortOrder,
                    updatedAt: new Date().toISOString()
                })
                .where(eq(categories.id, id))
        )

        await Promise.all(updatePromises)

        return c.json(successResponse({
            message: 'Categories reordered successfully',
            updated: categoryOrders.length
        }))
    } catch (error) {
        console.error('Error reordering categories:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to reorder categories'), 500)
    }
})