// CORS配置工具

export const corsConfig = {
    // 开发环境允许的源
    development: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ],

    // 生产环境允许的源（需要根据实际部署域名调整）
    production: [
        'https://*.pages.dev',
        'https://*.workers.dev'
    ]
}

// 获取CORS配置
export function getCorsOrigins(environment: string = 'development'): string[] {
    if (environment === 'production') {
        return corsConfig.production
    }
    return [...corsConfig.development, ...corsConfig.production]
}

// 检查源是否被允许
export function isOriginAllowed(origin: string, environment: string = 'development'): boolean {
    const allowedOrigins = getCorsOrigins(environment)

    // 检查精确匹配
    if (allowedOrigins.includes(origin)) {
        return true
    }

    // 检查通配符匹配
    return allowedOrigins.some(allowed => {
        if (allowed.includes('*')) {
            const pattern = allowed.replace(/\*/g, '.*')
            const regex = new RegExp(`^${pattern}$`)
            return regex.test(origin)
        }
        return false
    })
}