// 监控和分析工具

export interface PerformanceMetrics {
    responseTime: number
    timestamp: string
    endpoint: string
    method: string
    statusCode: number
    userAgent?: string
}

export interface ErrorLog {
    error: string
    stack?: string
    timestamp: string
    endpoint: string
    method: string
    userAgent?: string
    userId?: string
}

// 性能监控
export class PerformanceMonitor {
    private static metrics: PerformanceMetrics[] = []
    private static maxMetrics = 1000

    static recordMetric(metric: PerformanceMetrics) {
        this.metrics.push(metric)

        // 保持数组大小限制
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift()
        }
    }

    static getMetrics(limit: number = 100): PerformanceMetrics[] {
        return this.metrics.slice(-limit)
    }

    static getAverageResponseTime(endpoint?: string): number {
        let filteredMetrics = this.metrics

        if (endpoint) {
            filteredMetrics = this.metrics.filter(m => m.endpoint === endpoint)
        }

        if (filteredMetrics.length === 0) return 0

        const total = filteredMetrics.reduce((sum, m) => sum + m.responseTime, 0)
        return Math.round(total / filteredMetrics.length)
    }

    static getSlowRequests(threshold: number = 1000): PerformanceMetrics[] {
        return this.metrics.filter(m => m.responseTime > threshold)
    }
}

// 错误监控
export class ErrorMonitor {
    private static errors: ErrorLog[] = []
    private static maxErrors = 500

    static recordError(error: ErrorLog) {
        this.errors.push(error)

        // 保持数组大小限制
        if (this.errors.length > this.maxErrors) {
            this.errors.shift()
        }

        // 在开发环境中打印错误
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.error('Error recorded:', error)
        }
    }

    static getErrors(limit: number = 50): ErrorLog[] {
        return this.errors.slice(-limit)
    }

    static getErrorsByEndpoint(endpoint: string): ErrorLog[] {
        return this.errors.filter(e => e.endpoint === endpoint)
    }

    static getRecentErrors(minutes: number = 60): ErrorLog[] {
        const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString()
        return this.errors.filter(e => e.timestamp > cutoff)
    }
}

// 使用统计
export class UsageAnalytics {
    private static pageViews: { [key: string]: number } = {}
    private static apiCalls: { [key: string]: number } = {}

    static recordPageView(path: string) {
        this.pageViews[path] = (this.pageViews[path] || 0) + 1
    }

    static recordApiCall(endpoint: string) {
        this.apiCalls[endpoint] = (this.apiCalls[endpoint] || 0) + 1
    }

    static getPageViews(): { [key: string]: number } {
        return { ...this.pageViews }
    }

    static getApiCalls(): { [key: string]: number } {
        return { ...this.apiCalls }
    }

    static getTopPages(limit: number = 10): Array<{ path: string; views: number }> {
        return Object.entries(this.pageViews)
            .map(([path, views]) => ({ path, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, limit)
    }

    static getTopEndpoints(limit: number = 10): Array<{ endpoint: string; calls: number }> {
        return Object.entries(this.apiCalls)
            .map(([endpoint, calls]) => ({ endpoint, calls }))
            .sort((a, b) => b.calls - a.calls)
            .slice(0, limit)
    }
}

// React Hook for client-side monitoring
export function usePageTracking() {
    const trackPageView = (path: string) => {
        UsageAnalytics.recordPageView(path)

        // 可以在这里集成第三方分析服务
        // 例如 Google Analytics, Cloudflare Web Analytics 等
    }

    return { trackPageView }
}

// API 调用监控 Hook
export function useApiMonitoring() {
    const trackApiCall = (endpoint: string, responseTime: number, statusCode: number) => {
        UsageAnalytics.recordApiCall(endpoint)

        PerformanceMonitor.recordMetric({
            responseTime,
            timestamp: new Date().toISOString(),
            endpoint,
            method: 'GET', // 可以从实际请求中获取
            statusCode,
            userAgent: navigator.userAgent
        })
    }

    const trackError = (error: Error, endpoint: string) => {
        ErrorMonitor.recordError({
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            endpoint,
            method: 'GET', // 可以从实际请求中获取
            userAgent: navigator.userAgent
        })
    }

    return { trackApiCall, trackError }
}