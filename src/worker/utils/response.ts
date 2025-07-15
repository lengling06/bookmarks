// API响应工具函数

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        details?: any
    }
}

// 成功响应
export function successResponse<T>(data: T): ApiResponse<T> {
    return {
        success: true,
        data
    }
}

// 错误响应
export function errorResponse(code: string, message: string, details?: any): ApiResponse {
    return {
        success: false,
        error: {
            code,
            message,
            details
        }
    }
}

// 分页响应
export interface PaginatedResponse<T> {
    items: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export function paginatedResponse<T>(
    items: T[],
    page: number,
    limit: number,
    total: number,
    totalPages: number
): ApiResponse<PaginatedResponse<T>> {
    return successResponse({
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    })
}

// 常用错误响应
export const CommonErrors = {
    VALIDATION_ERROR: (message: string) => errorResponse('VALIDATION_ERROR', message),
    NOT_FOUND: (resource: string) => errorResponse('NOT_FOUND', `${resource} not found`),
    UNAUTHORIZED: () => errorResponse('UNAUTHORIZED', 'Authentication required'),
    FORBIDDEN: () => errorResponse('FORBIDDEN', 'Access denied'),
    INTERNAL_ERROR: (message?: string) => errorResponse('INTERNAL_ERROR', message || 'Internal server error'),
    INVALID_REQUEST: (message: string) => errorResponse('INVALID_REQUEST', message),
    DUPLICATE_RESOURCE: (resource: string) => errorResponse('DUPLICATE_RESOURCE', `${resource} already exists`)
}