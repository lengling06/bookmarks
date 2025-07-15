import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { admins } from '../../db/schema'
import { JWT, verifyPassword } from '../utils/crypto'
import { authMiddleware } from '../middleware/auth'
import { validateAdmin } from '../../utils/validation'
import { successResponse, errorResponse, CommonErrors } from '../utils/response'
import type { Env } from '../index'

export const adminRoutes = new Hono<{ Bindings: Env }>()

// 登录端点
adminRoutes.post('/login', async (c) => {
    try {
        const body = await c.req.json()
        const { username, password } = body

        // 验证输入
        const validation = validateAdmin({ username, password })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')

        // 查找管理员
        const adminList = await db
            .select()
            .from(admins)
            .where(eq(admins.username, username))
            .limit(1)

        const admin = adminList[0]
        if (!admin) {
            return c.json(CommonErrors.UNAUTHORIZED(), 401)
        }

        // 验证密码
        const isValidPassword = await verifyPassword(password, admin.passwordHash)
        if (!isValidPassword) {
            return c.json(CommonErrors.UNAUTHORIZED(), 401)
        }

        // 生成JWT token
        const jwtSecret = c.env.JWT_SECRET || 'default-secret'
        const token = await JWT.sign(
            {
                id: admin.id,
                username: admin.username,
                role: 'admin'
            },
            jwtSecret,
            24 * 60 * 60 // 24小时
        )

        return c.json(successResponse({
            token,
            user: {
                id: admin.id,
                username: admin.username,
                createdAt: admin.createdAt
            }
        }))
    } catch (error) {
        console.error('Login error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Login failed'), 500)
    }
})

// 验证token端点
adminRoutes.get('/verify', authMiddleware, async (c) => {
    const user = c.get('user')
    return c.json(successResponse({
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    }))
})

// 刷新token端点
adminRoutes.post('/refresh', authMiddleware, async (c) => {
    try {
        const user = c.get('user')
        const jwtSecret = c.env.JWT_SECRET || 'default-secret'

        const newToken = await JWT.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            jwtSecret,
            24 * 60 * 60 // 24小时
        )

        return c.json(successResponse({
            token: newToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }))
    } catch (error) {
        console.error('Token refresh error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Token refresh failed'), 500)
    }
})

// 修改密码端点
adminRoutes.post('/change-password', authMiddleware, async (c) => {
    try {
        const body = await c.req.json()
        const { currentPassword, newPassword } = body
        const user = c.get('user')

        // 验证新密码
        const validation = validateAdmin({ username: user.username, password: newPassword })
        if (!validation.isValid) {
            return c.json(CommonErrors.VALIDATION_ERROR(validation.errors.join(', ')), 400)
        }

        const db = c.get('db')

        // 获取当前管理员信息
        const adminList = await db
            .select()
            .from(admins)
            .where(eq(admins.id, user.id))
            .limit(1)

        const admin = adminList[0]
        if (!admin) {
            return c.json(CommonErrors.NOT_FOUND('Admin'), 404)
        }

        // 验证当前密码
        const isValidPassword = await verifyPassword(currentPassword, admin.passwordHash)
        if (!isValidPassword) {
            return c.json(errorResponse('INVALID_PASSWORD', 'Current password is incorrect'), 400)
        }

        // 更新密码
        const { hashPassword } = await import('../utils/crypto')
        const newPasswordHash = await hashPassword(newPassword)

        await db
            .update(admins)
            .set({
                passwordHash: newPasswordHash,
                updatedAt: new Date().toISOString()
            })
            .where(eq(admins.id, user.id))

        return c.json(successResponse({
            message: 'Password changed successfully'
        }))
    } catch (error) {
        console.error('Change password error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to change password'), 500)
    }
})

// 获取管理员信息
adminRoutes.get('/profile', authMiddleware, async (c) => {
    try {
        const user = c.get('user')
        const db = c.get('db')

        const adminList = await db
            .select({
                id: admins.id,
                username: admins.username,
                createdAt: admins.createdAt,
                updatedAt: admins.updatedAt
            })
            .from(admins)
            .where(eq(admins.id, user.id))
            .limit(1)

        const admin = adminList[0]
        if (!admin) {
            return c.json(CommonErrors.NOT_FOUND('Admin'), 404)
        }

        return c.json(successResponse(admin))
    } catch (error) {
        console.error('Get profile error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to get profile'), 500)
    }
})// 获取统计信
息
adminRoutes.get('/stats', authMiddleware, async (c) => {
    try {
        const db = c.get('db')

        // 导入必要的函数
        const { sql, desc, and, or } = await import('drizzle-orm')
        const { bookmarks, categories } = await import('../../db/schema')

        // 获取书签统计
        const totalBookmarksResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)

        const activeBookmarksResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(and(eq(bookmarks.isActive, true), eq(bookmarks.status, 'active')))

        const inactiveBookmarksResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(or(eq(bookmarks.isActive, false), eq(bookmarks.status, 'error')))

        // 获取分类统计
        const totalCategoriesResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(categories)

        // 获取最近添加的书签
        const recentBookmarks = await db
            .select({
                id: bookmarks.id,
                title: bookmarks.title,
                url: bookmarks.url,
                categoryId: bookmarks.categoryId,
                createdAt: bookmarks.createdAt,
                categoryName: categories.name
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .orderBy(desc(bookmarks.createdAt))
            .limit(10)

        // 获取分类分布统计
        const categoryStats = await db
            .select({
                categoryId: bookmarks.categoryId,
                categoryName: categories.name,
                bookmarkCount: sql<number>`count(${bookmarks.id})`
            })
            .from(bookmarks)
            .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
            .where(eq(bookmarks.isActive, true))
            .groupBy(bookmarks.categoryId, categories.name)
            .orderBy(desc(sql<number>`count(${bookmarks.id})`))

        // 获取状态分布
        const statusStats = await db
            .select({
                status: bookmarks.status,
                count: sql<number>`count(*)`
            })
            .from(bookmarks)
            .where(eq(bookmarks.isActive, true))
            .groupBy(bookmarks.status)

        // 获取最近检查的链接统计
        const recentCheckedResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookmarks)
            .where(
                and(
                    eq(bookmarks.isActive, true),
                    sql`${bookmarks.lastChecked} IS NOT NULL`,
                    sql`datetime(${bookmarks.lastChecked}) > datetime('now', '-7 days')`
                )
            )

        return c.json(successResponse({
            overview: {
                totalBookmarks: totalBookmarksResult[0]?.count || 0,
                totalCategories: totalCategoriesResult[0]?.count || 0,
                activeBookmarks: activeBookmarksResult[0]?.count || 0,
                inactiveBookmarks: inactiveBookmarksResult[0]?.count || 0,
                recentlyChecked: recentCheckedResult[0]?.count || 0
            },
            recentBookmarks: recentBookmarks.map(bookmark => ({
                id: bookmark.id,
                title: bookmark.title,
                url: bookmark.url,
                category: bookmark.categoryName,
                createdAt: bookmark.createdAt
            })),
            categoryDistribution: categoryStats,
            statusDistribution: statusStats,
            generatedAt: new Date().toISOString()
        }))
    } catch (error) {
        console.error('Stats error:', error)
        return c.json(CommonErrors.INTERNAL_ERROR('Failed to fetch statistics'), 500)
    }
})