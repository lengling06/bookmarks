// 数据验证工具函数

export interface ValidationResult {
    isValid: boolean
    errors: string[]
}

// 验证分类数据
export function validateCategory(data: {
    name?: string
    description?: string
    sortOrder?: number
}): ValidationResult {
    const errors: string[] = []

    if (!data.name || data.name.trim().length === 0) {
        errors.push('分类名称不能为空')
    }

    if (data.name && data.name.length > 100) {
        errors.push('分类名称不能超过100个字符')
    }

    if (data.description && data.description.length > 500) {
        errors.push('分类描述不能超过500个字符')
    }

    if (data.sortOrder !== undefined && (data.sortOrder < 0 || data.sortOrder > 9999)) {
        errors.push('排序值必须在0-9999之间')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// 验证书签数据
export function validateBookmark(data: {
    title?: string
    url?: string
    description?: string
    categoryId?: number
    tags?: string[]
}): ValidationResult {
    const errors: string[] = []

    if (!data.title || data.title.trim().length === 0) {
        errors.push('书签标题不能为空')
    }

    if (data.title && data.title.length > 200) {
        errors.push('书签标题不能超过200个字符')
    }

    if (!data.url || data.url.trim().length === 0) {
        errors.push('书签URL不能为空')
    }

    if (data.url && !isValidUrl(data.url)) {
        errors.push('请输入有效的URL地址')
    }

    if (data.description && data.description.length > 1000) {
        errors.push('书签描述不能超过1000个字符')
    }

    if (!data.categoryId || data.categoryId <= 0) {
        errors.push('请选择有效的分类')
    }

    if (data.tags && data.tags.length > 10) {
        errors.push('标签数量不能超过10个')
    }

    if (data.tags) {
        for (const tag of data.tags) {
            if (tag.length > 50) {
                errors.push('单个标签长度不能超过50个字符')
                break
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// 验证管理员数据
export function validateAdmin(data: {
    username?: string
    password?: string
}): ValidationResult {
    const errors: string[] = []

    if (!data.username || data.username.trim().length === 0) {
        errors.push('用户名不能为空')
    }

    if (data.username && (data.username.length < 3 || data.username.length > 50)) {
        errors.push('用户名长度必须在3-50个字符之间')
    }

    if (data.username && !/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push('用户名只能包含字母、数字和下划线')
    }

    if (!data.password || data.password.length === 0) {
        errors.push('密码不能为空')
    }

    if (data.password && data.password.length < 6) {
        errors.push('密码长度不能少于6个字符')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// 验证搜索参数
export function validateSearchParams(params: {
    q?: string
    page?: number
    limit?: number
}): ValidationResult {
    const errors: string[] = []

    if (params.q && params.q.length > 100) {
        errors.push('搜索关键词不能超过100个字符')
    }

    if (params.page !== undefined && (params.page < 1 || params.page > 1000)) {
        errors.push('页码必须在1-1000之间')
    }

    if (params.limit !== undefined && (params.limit < 1 || params.limit > 100)) {
        errors.push('每页数量必须在1-100之间')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// 辅助函数：验证URL
function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}