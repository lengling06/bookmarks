// 书签导出工具函数

import { parseTags } from '../../utils/database'

export interface ExportBookmark {
    id: number
    title: string
    url: string
    description?: string
    tags: string[]
    categoryName: string
    createdAt: string
    updatedAt: string
}

// 导出为HTML格式（Chrome/Firefox兼容）
export function exportToHtml(bookmarks: ExportBookmark[]): string {
    const now = new Date().toISOString()

    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`

    // 按分类分组
    const bookmarksByCategory = new Map<string, ExportBookmark[]>()

    for (const bookmark of bookmarks) {
        const category = bookmark.categoryName || '未分类'
        if (!bookmarksByCategory.has(category)) {
            bookmarksByCategory.set(category, [])
        }
        bookmarksByCategory.get(category)!.push(bookmark)
    }

    // 生成HTML
    for (const [categoryName, categoryBookmarks] of bookmarksByCategory) {
        html += `    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">${escapeHtml(categoryName)}</H3>\n`
        html += `    <DL><p>\n`

        for (const bookmark of categoryBookmarks) {
            const addDate = Math.floor(new Date(bookmark.createdAt).getTime() / 1000)
            const lastModified = Math.floor(new Date(bookmark.updatedAt).getTime() / 1000)

            html += `        <DT><A HREF="${escapeHtml(bookmark.url)}" ADD_DATE="${addDate}" LAST_MODIFIED="${lastModified}"`

            if (bookmark.tags.length > 0) {
                html += ` TAGS="${escapeHtml(bookmark.tags.join(','))}"`
            }

            html += `>${escapeHtml(bookmark.title)}</A>\n`

            if (bookmark.description) {
                html += `        <DD>${escapeHtml(bookmark.description)}\n`
            }
        }

        html += `    </DL><p>\n`
    }

    html += `</DL><p>\n`

    return html
}

// 导出为JSON格式
export function exportToJson(bookmarks: ExportBookmark[]): string {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        source: 'Bookmark Manager',
        bookmarks: bookmarks.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description || null,
            category: bookmark.categoryName,
            tags: bookmark.tags,
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt
        }))
    }

    return JSON.stringify(exportData, null, 2)
}

// 导出为CSV格式
export function exportToCsv(bookmarks: ExportBookmark[]): string {
    const headers = ['ID', 'Title', 'URL', 'Description', 'Category', 'Tags', 'Created At', 'Updated At']

    let csv = headers.map(header => `"${header}"`).join(',') + '\n'

    for (const bookmark of bookmarks) {
        const row = [
            bookmark.id.toString(),
            escapeCsv(bookmark.title),
            escapeCsv(bookmark.url),
            escapeCsv(bookmark.description || ''),
            escapeCsv(bookmark.categoryName),
            escapeCsv(bookmark.tags.join(', ')),
            escapeCsv(bookmark.createdAt),
            escapeCsv(bookmark.updatedAt)
        ]

        csv += row.map(field => `"${field}"`).join(',') + '\n'
    }

    return csv
}

// 导出为Chrome书签格式的JSON
export function exportToChromeJson(bookmarks: ExportBookmark[]): string {
    const bookmarksByCategory = new Map<string, ExportBookmark[]>()

    for (const bookmark of bookmarks) {
        const category = bookmark.categoryName || '未分类'
        if (!bookmarksByCategory.has(category)) {
            bookmarksByCategory.set(category, [])
        }
        bookmarksByCategory.get(category)!.push(bookmark)
    }

    const folders: any[] = []

    for (const [categoryName, categoryBookmarks] of bookmarksByCategory) {
        const folder = {
            date_added: Math.floor(Date.now() / 1000).toString(),
            date_modified: Math.floor(Date.now() / 1000).toString(),
            id: Math.floor(Math.random() * 1000000).toString(),
            name: categoryName,
            type: 'folder',
            children: categoryBookmarks.map(bookmark => ({
                date_added: Math.floor(new Date(bookmark.createdAt).getTime() / 1000).toString(),
                id: bookmark.id.toString(),
                name: bookmark.title,
                type: 'url',
                url: bookmark.url
            }))
        }

        folders.push(folder)
    }

    const chromeBookmarks = {
        checksum: generateChecksum(),
        roots: {
            bookmark_bar: {
                children: folders,
                date_added: Math.floor(Date.now() / 1000).toString(),
                date_modified: Math.floor(Date.now() / 1000).toString(),
                id: '1',
                name: 'Bookmarks bar',
                type: 'folder'
            },
            other: {
                children: [],
                date_added: Math.floor(Date.now() / 1000).toString(),
                date_modified: Math.floor(Date.now() / 1000).toString(),
                id: '2',
                name: 'Other bookmarks',
                type: 'folder'
            },
            synced: {
                children: [],
                date_added: Math.floor(Date.now() / 1000).toString(),
                date_modified: Math.floor(Date.now() / 1000).toString(),
                id: '3',
                name: 'Mobile bookmarks',
                type: 'folder'
            }
        },
        version: 1
    }

    return JSON.stringify(chromeBookmarks, null, 2)
}

// HTML转义
function escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

// CSV转义
function escapeCsv(text: string): string {
    return text.replace(/"/g, '""')
}

// 生成简单的校验和
function generateChecksum(): string {
    return Math.random().toString(36).substring(2, 15)
}

// 获取文件MIME类型
export function getMimeType(format: string): string {
    switch (format) {
        case 'html':
            return 'text/html'
        case 'json':
        case 'chrome-json':
            return 'application/json'
        case 'csv':
            return 'text/csv'
        default:
            return 'text/plain'
    }
}

// 获取文件扩展名
export function getFileExtension(format: string): string {
    switch (format) {
        case 'html':
            return 'html'
        case 'json':
        case 'chrome-json':
            return 'json'
        case 'csv':
            return 'csv'
        default:
            return 'txt'
    }
}

// 生成文件名
export function generateFileName(format: string, prefix: string = 'bookmarks'): string {
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const extension = getFileExtension(format)
    return `${prefix}_${timestamp}.${extension}`
}