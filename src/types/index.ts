// 前端使用的类型定义，基于数据库schema但更适合前端使用

export interface Category {
    id: number
    name: string
    description?: string
    sortOrder: number
    bookmarkCount?: number
    createdAt: string
    updatedAt: string
}

export interface Bookmark {
    id: number
    title: string
    url: string
    description?: string
    categoryId: number
    category?: Category
    tags: string[]
    isActive: boolean
    lastChecked?: string
    status: 'active' | 'inactive' | 'error'
    createdAt: string
    updatedAt: string
}

export interface Admin {
    id: number
    username: string
    createdAt: string
    updatedAt: string
}

// API响应类型
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        details?: any
    }
}

// 分页响应类型
export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// 搜索参数类型
export interface SearchParams {
    q?: string
    categoryId?: number
    tags?: string[]
    page?: number
    limit?: number
}

// 统计数据类型
export interface Stats {
    totalBookmarks: number
    totalCategories: number
    activeBookmarks: number
    inactiveBookmarks: number
    recentBookmarks: Bookmark[]
}

// 导入结果类型
export interface ImportResult {
    success: number
    failed: number
    skipped: number
    errors: string[]
}

// 链接检查结果类型
export interface LinkCheckResult {
    bookmarkId: number
    url: string
    status: 'success' | 'error'
    statusCode?: number
    error?: string
    responseTime?: number
}