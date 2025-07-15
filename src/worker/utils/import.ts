// 书签导入工具函数

export interface ImportBookmark {
    title: string
    url: string
    description?: string
    tags?: string[]
    folder?: string
}

export interface ImportResult {
    success: number
    failed: number
    skipped: number
    errors: string[]
    duplicates: number
}

// 解析HTML格式的书签文件（Chrome/Firefox导出格式）
export function parseHtmlBookmarks(htmlContent: string): ImportBookmark[] {
    const bookmarks: ImportBookmark[] = []

    try {
        // 简单的HTML解析，匹配<A>标签
        const linkRegex = /<A[^>]+HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi
        const folderRegex = /<H3[^>]*>([^<]+)<\/H3>/gi

        let currentFolder = ''
        let match

        // 先找文件夹
        const lines = htmlContent.split('\n')

        for (const line of lines) {
            // 检查是否是文件夹标题
            const folderMatch = folderRegex.exec(line)
            if (folderMatch) {
                currentFolder = folderMatch[1].trim()
                continue
            }

            // 检查是否是书签链接
            const linkMatch = linkRegex.exec(line)
            if (linkMatch) {
                const url = linkMatch[1]
                const title = linkMatch[2]

                // 提取描述（如果有）
                let description = ''
                const descMatch = line.match(/<DD>([^<]+)/i)
                if (descMatch) {
                    description = descMatch[1].trim()
                }

                bookmarks.push({
                    title: title.trim(),
                    url: url.trim(),
                    description: description || undefined,
                    folder: currentFolder || undefined
                })
            }

            // 重置regex lastIndex
            linkRegex.lastIndex = 0
            folderRegex.lastIndex = 0
        }
    } catch (error) {
        console.error('Error parsing HTML bookmarks:', error)
    }

    return bookmarks
}

// 解析JSON格式的书签文件
export function parseJsonBookmarks(jsonContent: string): ImportBookmark[] {
    const bookmarks: ImportBookmark[] = []

    try {
        const data = JSON.parse(jsonContent)

        // 处理Chrome书签格式
        if (data.roots) {
            const processFolder = (folder: any, folderName = '') => {
                if (folder.children) {
                    for (const item of folder.children) {
                        if (item.type === 'folder') {
                            processFolder(item, item.name)
                        } else if (item.type === 'url') {
                            bookmarks.push({
                                title: item.name || 'Untitled',
                                url: item.url,
                                folder: folderName || undefined
                            })
                        }
                    }
                }
            }

            // 处理书签栏和其他文件夹
            if (data.roots.bookmark_bar) {
                processFolder(data.roots.bookmark_bar, '书签栏')
            }
            if (data.roots.other) {
                processFolder(data.roots.other, '其他书签')
            }
        }
        // 处理简单的JSON数组格式
        else if (Array.isArray(data)) {
            for (const item of data) {
                if (item.url && item.title) {
                    bookmarks.push({
                        title: item.title,
                        url: item.url,
                        description: item.description,
                        tags: item.tags,
                        folder: item.folder
                    })
                }
            }
        }
        // 处理对象格式
        else if (data.bookmarks && Array.isArray(data.bookmarks)) {
            for (const item of data.bookmarks) {
                if (item.url && item.title) {
                    bookmarks.push({
                        title: item.title,
                        url: item.url,
                        description: item.description,
                        tags: item.tags,
                        folder: item.folder
                    })
                }
            }
        }
    } catch (error) {
        console.error('Error parsing JSON bookmarks:', error)
    }

    return bookmarks
}

// 验证书签数据
export function validateImportBookmark(bookmark: ImportBookmark): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!bookmark.title || bookmark.title.trim().length === 0) {
        errors.push('书签标题不能为空')
    }

    if (!bookmark.url || bookmark.url.trim().length === 0) {
        errors.push('书签URL不能为空')
    }

    if (bookmark.url) {
        try {
            new URL(bookmark.url)
        } catch {
            errors.push('无效的URL格式')
        }
    }

    if (bookmark.title && bookmark.title.length > 200) {
        errors.push('书签标题过长')
    }

    if (bookmark.description && bookmark.description.length > 1000) {
        errors.push('书签描述过长')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// 清理和标准化书签数据
export function normalizeImportBookmark(bookmark: ImportBookmark): ImportBookmark {
    return {
        title: bookmark.title.trim(),
        url: normalizeUrl(bookmark.url.trim()),
        description: bookmark.description?.trim() || undefined,
        tags: bookmark.tags?.filter(tag => tag.trim().length > 0).map(tag => tag.trim()) || undefined,
        folder: bookmark.folder?.trim() || undefined
    }
}

// 标准化URL（从database utils导入）
function normalizeUrl(url: string): string {
    try {
        const urlObj = new URL(url)
        if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
            urlObj.pathname = urlObj.pathname.slice(0, -1)
        }
        return urlObj.toString()
    } catch {
        return url
    }
}

// 检测文件格式
export function detectBookmarkFormat(content: string): 'html' | 'json' | 'unknown' {
    const trimmedContent = content.trim()

    if (trimmedContent.startsWith('<!DOCTYPE') || trimmedContent.includes('<H1>Bookmarks</H1>')) {
        return 'html'
    }

    if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
        try {
            JSON.parse(trimmedContent)
            return 'json'
        } catch {
            return 'unknown'
        }
    }

    return 'unknown'
}

// 批量处理书签导入
export function processBatchImport(
    bookmarks: ImportBookmark[],
    existingUrls: Set<string>,
    skipDuplicates: boolean = true
): {
    toImport: ImportBookmark[]
    duplicates: ImportBookmark[]
    invalid: { bookmark: ImportBookmark; errors: string[] }[]
} {
    const toImport: ImportBookmark[] = []
    const duplicates: ImportBookmark[] = []
    const invalid: { bookmark: ImportBookmark; errors: string[] }[] = []

    for (const bookmark of bookmarks) {
        // 验证书签
        const validation = validateImportBookmark(bookmark)
        if (!validation.isValid) {
            invalid.push({ bookmark, errors: validation.errors })
            continue
        }

        // 标准化书签
        const normalizedBookmark = normalizeImportBookmark(bookmark)

        // 检查重复
        if (existingUrls.has(normalizedBookmark.url)) {
            duplicates.push(normalizedBookmark)
            if (skipDuplicates) {
                continue
            }
        }

        toImport.push(normalizedBookmark)
    }

    return { toImport, duplicates, invalid }
}