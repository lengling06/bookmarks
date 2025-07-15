// 数据库工具函数

// 将数据库时间戳转换为Date对象
export function parseDbTimestamp(timestamp: string): Date {
    return new Date(timestamp)
}

// 将Date对象转换为数据库时间戳格式
export function formatDbTimestamp(date: Date): string {
    return date.toISOString()
}

// 解析JSON字符串标签
export function parseTags(tagsJson: string | null): string[] {
    if (!tagsJson) return []
    try {
        return JSON.parse(tagsJson)
    } catch {
        return []
    }
}

// 将标签数组转换为JSON字符串
export function stringifyTags(tags: string[]): string {
    return JSON.stringify(tags)
}

// 生成分页偏移量
export function getPaginationOffset(page: number, limit: number): number {
    return (page - 1) * limit
}

// 计算总页数
export function getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit)
}

// 验证URL格式
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

// 清理和标准化URL
export function normalizeUrl(url: string): string {
    try {
        const urlObj = new URL(url)
        // 移除尾部斜杠
        if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
            urlObj.pathname = urlObj.pathname.slice(0, -1)
        }
        return urlObj.toString()
    } catch {
        return url
    }
}