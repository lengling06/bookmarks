import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createDatabase } from '../db'
import { publicRoutes } from './routes/public'
import { adminRoutes } from './routes/admin'

// 环境变量类型定义
export interface Env {
    DB: any
    ENVIRONMENT: string
    JWT_SECRET?: string
    ADMIN_USERNAME?: string
    ADMIN_PASSWORD_HASH?: string
}

// 创建Hono应用
const app = new Hono<{ Bindings: Env }>()

// 中间件配置
app.use('*', logger())

// CORS 配置
app.use('*', cors({
    origin: (origin) => {
        // 开发环境
        const devOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000']
        if (devOrigins.includes(origin)) return origin

        // 生产环境 - Cloudflare Pages
        if (origin && origin.match(/https:\/\/.*\.pages\.dev$/)) return origin

        // 自定义域名（根据需要添加）
        // if (origin === 'https://your-domain.com') return origin

        return false
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// 性能监控中间件
app.use('*', async (c, next) => {
    const start = Date.now()
    await next()
    const duration = Date.now() - start

    // 记录慢请求
    if (duration > 1000) {
        console.warn(`Slow request: ${c.req.method} ${c.req.url} took ${duration}ms`)
    }

    // 添加性能头
    c.res.headers.set('X-Response-Time', `${duration}ms`)
})

// 数据库中间件
app.use('*', async (c, next) => {
    const db = createDatabase(c.env.DB)
    c.set('db', db)
    await next()
})

// 健康检查端点
app.get('/health', (c) => {
    return c.json({
        success: true,
        message: 'Bookmark Manager API is running',
        timestamp: new Date().toISOString(),
        environment: c.env.ENVIRONMENT || 'development'
    })
})

// 导入管理员路由
import { categoryRoutes } from './routes/categories'
import { bookmarkRoutes } from './routes/bookmarks'
import { importRoutes } from './routes/import'
import { exportRoutes } from './routes/export'
import { linkCheckerRoutes } from './routes/linkChecker'

// API路由
app.route('/api', publicRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/admin/categories', categoryRoutes)
app.route('/api/admin/bookmarks', bookmarkRoutes)
app.route('/api/admin/import', importRoutes)
app.route('/api/admin/export', exportRoutes)
app.route('/api/admin/links', linkCheckerRoutes)

// 404处理
app.notFound((c) => {
    return c.json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'API endpoint not found'
        }
    }, 404)
})

// 错误处理
app.onError((err, c) => {
    console.error('API Error:', err)

    return c.json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: c.env.ENVIRONMENT === 'production'
                ? 'Internal server error'
                : err.message
        }
    }, 500)
})

export default app