import { Context, Next } from 'hono'
import { JWT } from '../utils/crypto'
import { CommonErrors } from '../utils/response'
import type { Env } from '../index'

// 认证中间件
export const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    try {
        const authHeader = c.req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json(CommonErrors.UNAUTHORIZED(), 401)
        }

        const token = authHeader.substring(7) // 移除 "Bearer " 前缀
        const jwtSecret = c.env.JWT_SECRET || 'default-secret'

        // 验证token
        const payload = await JWT.verify(token, jwtSecret)

        // 将用户信息添加到上下文
        c.set('user', payload)

        await next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        return c.json(CommonErrors.UNAUTHORIZED(), 401)
    }
}

// 可选的认证中间件（用于某些可以匿名访问的端点）
export const optionalAuthMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    try {
        const authHeader = c.req.header('Authorization')

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7)
            const jwtSecret = c.env.JWT_SECRET || 'default-secret'

            try {
                const payload = await JWT.verify(token, jwtSecret)
                c.set('user', payload)
            } catch (error) {
                // 忽略token验证错误，继续处理请求
                console.warn('Optional auth failed:', error)
            }
        }

        await next()
    } catch (error) {
        // 忽略认证错误，继续处理请求
        console.warn('Optional auth middleware error:', error)
        await next()
    }
}

// 角色检查中间件
export const requireRole = (role: string) => {
    return async (c: Context<{ Bindings: Env }>, next: Next) => {
        const user = c.get('user')

        if (!user || user.role !== role) {
            return c.json(CommonErrors.FORBIDDEN(), 403)
        }

        await next()
    }
}

// 管理员权限中间件
export const requireAdmin = requireRole('admin')