import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import type { Category, Bookmark, SearchParams, PaginatedResponse, ApiResponse } from '../types'

// API基础配置
const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api'

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
})

// 请求拦截器 - 添加认证token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器 - 处理错误
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token')
            window.location.href = '/admin/login'
        }
        return Promise.reject(error)
    }
)

// 公开API hooks
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Category[]>>('/categories')
            return response.data.data || []
        },
    })
}

export const useCategoryBookmarks = (categoryId: number, page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['category-bookmarks', categoryId, page, limit],
        queryFn: async () => {
            const response = await api.get<ApiResponse<PaginatedResponse<Bookmark>>>(
                `/categories/${categoryId}/bookmarks?page=${page}&limit=${limit}`
            )
            return response.data.data
        },
        enabled: !!categoryId,
    })
}

export const useSearchBookmarks = (params: SearchParams) => {
    return useQuery({
        queryKey: ['search-bookmarks', params],
        queryFn: async () => {
            const searchParams = new URLSearchParams()
            if (params.q) searchParams.append('q', params.q)
            if (params.page) searchParams.append('page', params.page.toString())
            if (params.limit) searchParams.append('limit', params.limit.toString())

            const response = await api.get<ApiResponse<PaginatedResponse<Bookmark>>>(
                `/search?${searchParams.toString()}`
            )
            return response.data.data
        },
        enabled: !!params.q && params.q.trim().length > 0,
    })
}

// 管理员API hooks
export const useAdminLogin = () => {
    return useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            const response = await api.post<ApiResponse<{ token: string; user: any }>>('/admin/login', credentials)
            return response.data.data
        },
    })
}

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<any>>('/admin/stats')
            return response.data.data
        },
    })
}

export const useAdminCategories = () => {
    return useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Category[]>>('/admin/categories')
            return response.data.data || []
        },
    })
}

export const useAdminBookmarks = (params: any = {}) => {
    return useQuery({
        queryKey: ['admin-bookmarks', params],
        queryFn: async () => {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value) searchParams.append(key, value.toString())
            })

            const response = await api.get<ApiResponse<PaginatedResponse<Bookmark>>>(
                `/admin/bookmarks?${searchParams.toString()}`
            )
            return response.data.data
        },
    })
}

// 导出API实例供其他地方使用
export { api }