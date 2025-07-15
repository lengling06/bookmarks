// 链接验证工具函数

export interface LinkCheckResult {
    bookmarkId: number
    url: string
    status: 'success' | 'error' | 'timeout'
    statusCode?: number
    error?: string
    responseTime?: number
    checkedAt: string
}

export interface BatchCheckResult {
    total: number
    success: number
    failed: number
    results: LinkCheckResult[]
}

// 检查单个链接
export async function checkSingleLink(
    bookmarkId: number,
    url: string,
    timeout: number = 10000
): Promise<LinkCheckResult> {
    const startTime = Date.now()
    const checkedAt = new Date().toISOString()

    try {
        // 创建AbortController用于超时控制
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
            method: 'HEAD', // 使用HEAD请求减少数据传输
            signal: controller.signal,
            headers: {
                'User-Agent': 'Bookmark-Manager/1.0 (Link Checker)',
                'Accept': '*/*'
            },
            // 不跟随重定向，但记录重定向状态
            redirect: 'manual'
        })

        clearTimeout(timeoutId)
        const responseTime = Date.now() - startTime

        // 2xx, 3xx状态码都认为是成功的
        if (response.status >= 200 && response.status < 400) {
            return {
                bookmarkId,
                url,
                status: 'success',
                statusCode: response.status,
                responseTime,
                checkedAt
            }
        } else {
            return {
                bookmarkId,
                url,
                status: 'error',
                statusCode: response.status,
                error: `HTTP ${response.status} ${response.statusText}`,
                responseTime,
                checkedAt
            }
        }
    } catch (error: any) {
        const responseTime = Date.now() - startTime

        if (error.name === 'AbortError') {
            return {
                bookmarkId,
                url,
                status: 'timeout',
                error: 'Request timeout',
                responseTime,
                checkedAt
            }
        }

        return {
            bookmarkId,
            url,
            status: 'error',
            error: error.message || 'Unknown error',
            responseTime,
            checkedAt
        }
    }
}

// 批量检查链接（带并发控制）
export async function checkMultipleLinks(
    bookmarks: { id: number; url: string }[],
    options: {
        timeout?: number
        concurrency?: number
        delay?: number
    } = {}
): Promise<BatchCheckResult> {
    const { timeout = 10000, concurrency = 5, delay = 100 } = options
    const results: LinkCheckResult[] = []

    // 分批处理以控制并发
    for (let i = 0; i < bookmarks.length; i += concurrency) {
        const batch = bookmarks.slice(i, i + concurrency)

        const batchPromises = batch.map(bookmark =>
            checkSingleLink(bookmark.id, bookmark.url, timeout)
        )

        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)

        // 批次间延迟，避免过于频繁的请求
        if (i + concurrency < bookmarks.length && delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    // 统计结果
    const success = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'error' || r.status === 'timeout').length

    return {
        total: results.length,
        success,
        failed,
        results
    }
}

// 检查URL是否可能有效（基本格式验证）
export function isValidUrlFormat(url: string): boolean {
    try {
        const urlObj = new URL(url)
        return ['http:', 'https:'].includes(urlObj.protocol)
    } catch {
        return false
    }
}

// 检测重复URL
export function findDuplicateUrls(bookmarks: { id: number; url: string }[]): Map<string, number[]> {
    const urlMap = new Map<string, number[]>()

    for (const bookmark of bookmarks) {
        const normalizedUrl = normalizeUrlForComparison(bookmark.url)

        if (!urlMap.has(normalizedUrl)) {
            urlMap.set(normalizedUrl, [])
        }
        urlMap.get(normalizedUrl)!.push(bookmark.id)
    }

    // 只返回有重复的URL
    const duplicates = new Map<string, number[]>()
    for (const [url, ids] of urlMap) {
        if (ids.length > 1) {
            duplicates.set(url, ids)
        }
    }

    return duplicates
}

// 标准化URL用于比较（移除查询参数、片段等）
function normalizeUrlForComparison(url: string): string {
    try {
        const urlObj = new URL(url)
        // 移除查询参数和片段
        urlObj.search = ''
        urlObj.hash = ''
        // 移除尾部斜杠
        if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
            urlObj.pathname = urlObj.pathname.slice(0, -1)
        }
        // 转换为小写
        return urlObj.toString().toLowerCase()
    } catch {
        return url.toLowerCase()
    }
}

// 生成链接检查报告
export function generateLinkCheckReport(results: LinkCheckResult[]): {
    summary: {
        total: number
        success: number
        failed: number
        timeout: number
        successRate: number
    }
    failedLinks: LinkCheckResult[]
    slowLinks: LinkCheckResult[]
    averageResponseTime: number
} {
    const total = results.length
    const success = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'error').length
    const timeout = results.filter(r => r.status === 'timeout').length
    const successRate = total > 0 ? (success / total) * 100 : 0

    const failedLinks = results.filter(r => r.status !== 'success')
    const slowLinks = results
        .filter(r => r.responseTime && r.responseTime > 5000)
        .sort((a, b) => (b.responseTime || 0) - (a.responseTime || 0))

    const totalResponseTime = results
        .filter(r => r.responseTime)
        .reduce((sum, r) => sum + (r.responseTime || 0), 0)
    const averageResponseTime = results.length > 0 ? totalResponseTime / results.length : 0

    return {
        summary: {
            total,
            success,
            failed,
            timeout,
            successRate: Math.round(successRate * 100) / 100
        },
        failedLinks,
        slowLinks,
        averageResponseTime: Math.round(averageResponseTime)
    }
}