import { useState } from 'react'

export default function ImportExport() {
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
    const [importFile, setImportFile] = useState<File | null>(null)
    const [importProgress, setImportProgress] = useState<any>(null)
    const [exportFormat, setExportFormat] = useState<'html' | 'json' | 'csv'>('html')
    const [exportFilters, setExportFilters] = useState({
        categoryId: 'all',
        includeInactive: false
    })

    // 模拟分类数据
    const categories = [
        { id: 1, name: '开发工具' },
        { id: 2, name: '设计资源' },
        { id: 3, name: '学习资料' },
    ]

    // 处理文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImportFile(file)
        }
    }

    // 解析Chrome书签HTML格式
    const parseChromeBookmarks = (htmlContent: string) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        const bookmarks: any[] = []

        // 递归解析书签文件夹和书签
        const parseFolder = (element: Element, categoryName = '未分类') => {
            const links = element.querySelectorAll('a')
            links.forEach(link => {
                const href = link.getAttribute('href')
                const title = link.textContent?.trim()
                const addDate = link.getAttribute('add_date')

                if (href && title) {
                    bookmarks.push({
                        title,
                        url: href,
                        description: '',
                        category: categoryName,
                        tags: [],
                        addDate: addDate ? new Date(parseInt(addDate) * 1000).toISOString() : new Date().toISOString()
                    })
                }
            })

            // 递归处理子文件夹
            const folders = element.querySelectorAll('dt > h3')
            folders.forEach(folder => {
                const folderName = folder.textContent?.trim() || '未分类'
                const nextElement = folder.parentElement?.nextElementSibling
                if (nextElement && nextElement.tagName === 'DD') {
                    parseFolder(nextElement, folderName)
                }
            })
        }

        parseFolder(doc.body)
        return bookmarks
    }

    // 解析JSON格式书签
    const parseJsonBookmarks = (jsonContent: string) => {
        try {
            const data = JSON.parse(jsonContent)
            // 处理不同的JSON格式
            if (Array.isArray(data)) {
                return data.map(item => ({
                    title: item.title || item.name || '未命名',
                    url: item.url || item.href || '',
                    description: item.description || item.desc || '',
                    category: item.category || item.folder || '未分类',
                    tags: item.tags || [],
                    addDate: item.addDate || item.createdAt || new Date().toISOString()
                }))
            }
            return []
        } catch (error) {
            console.error('JSON解析失败:', error)
            return []
        }
    }

    // 开始导入
    const handleImport = async () => {
        if (!importFile) {
            alert('请选择要导入的文件')
            return
        }

        setImportProgress({ status: 'processing', message: '正在解析文件...' })

        try {
            const fileContent = await importFile.text()
            let bookmarks: any[] = []

            // 根据文件类型解析
            if (importFile.name.toLowerCase().endsWith('.html')) {
                bookmarks = parseChromeBookmarks(fileContent)
            } else if (importFile.name.toLowerCase().endsWith('.json')) {
                bookmarks = parseJsonBookmarks(fileContent)
            } else {
                throw new Error('不支持的文件格式，请选择HTML或JSON文件')
            }

            if (bookmarks.length === 0) {
                throw new Error('文件中没有找到有效的书签数据')
            }

            setImportProgress({
                status: 'success',
                message: `成功解析 ${bookmarks.length} 个书签`,
                data: bookmarks.slice(0, 10) // 只显示前10个预览
            })

        } catch (error: any) {
            setImportProgress({
                status: 'error',
                message: error.message || '导入失败，请检查文件格式'
            })
        }
    }

    // 确认导入
    const confirmImport = () => {
        // 这里应该调用API保存书签到数据库
        setImportProgress({
            status: 'completed',
            message: '书签导入完成！'
        })

        // 3秒后重置状态
        setTimeout(() => {
            setImportProgress(null)
            setImportFile(null)
        }, 3000)
    }

    // 导出书签
    const handleExport = () => {
        // 模拟导出数据
        const mockBookmarks = [
            { id: 1, title: 'GitHub', url: 'https://github.com', description: '代码托管平台', category: '开发工具', tags: ['代码', '开源'] },
            { id: 2, title: 'Figma', url: 'https://figma.com', description: 'UI设计工具', category: '设计资源', tags: ['设计', 'UI'] },
        ]

        let content = ''
        let filename = ''
        let mimeType = ''

        switch (exportFormat) {
            case 'html':
                content = generateHtmlExport(mockBookmarks)
                filename = 'bookmarks.html'
                mimeType = 'text/html'
                break
            case 'json':
                content = JSON.stringify(mockBookmarks, null, 2)
                filename = 'bookmarks.json'
                mimeType = 'application/json'
                break
            case 'csv':
                content = generateCsvExport(mockBookmarks)
                filename = 'bookmarks.csv'
                mimeType = 'text/csv'
                break
        }

        // 下载文件
        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // 生成HTML格式导出
    const generateHtmlExport = (bookmarks: any[]) => {
        const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
            if (!acc[bookmark.category]) {
                acc[bookmark.category] = []
            }
            acc[bookmark.category].push(bookmark)
            return acc
        }, {} as Record<string, any[]>)

        let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`

        Object.entries(groupedBookmarks).forEach(([category, bookmarks]) => {
            html += `
    <DT><H3>${category}</H3>
    <DL><p>`
            bookmarks.forEach(bookmark => {
                html += `
        <DT><A HREF="${bookmark.url}">${bookmark.title}</A>`
            })
            html += `
    </DL><p>`
        })

        html += `
</DL><p>`
        return html
    }

    // 生成CSV格式导出
    const generateCsvExport = (bookmarks: any[]) => {
        const headers = ['标题', 'URL', '描述', '分类', '标签']
        const rows = bookmarks.map(bookmark => [
            bookmark.title,
            bookmark.url,
            bookmark.description,
            bookmark.category,
            bookmark.tags.join(';')
        ])

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n')
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h2 className="text-3xl font-light text-gray-800 mb-2">导入导出</h2>
                <p className="text-gray-500">导入Chrome书签或导出现有书签数据</p>
            </div>

            {/* 标签页切换 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'import'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        📥 导入书签
                    </button>
                    <button
                        onClick={() => setActiveTab('export')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'export'
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        📤 导出书签
                    </button>
                </div>

                {/* 导入标签页 */}
                {activeTab === 'import' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">支持的格式</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• <strong>Chrome书签HTML文件</strong> - 从Chrome导出的书签文件</li>
                                <li>• <strong>JSON格式</strong> - 标准的JSON书签数据</li>
                            </ul>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                选择书签文件
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    accept=".html,.json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="bookmark-file"
                                />
                                <label htmlFor="bookmark-file" className="cursor-pointer">
                                    <div className="text-4xl mb-4">📁</div>
                                    <p className="text-gray-600 mb-2">
                                        点击选择文件或拖拽文件到此处
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        支持 .html 和 .json 格式
                                    </p>
                                </label>
                            </div>

                            {importFile && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <p className="font-medium text-gray-900">{importFile.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {(importFile.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setImportFile(null)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {importFile && !importProgress && (
                            <button
                                onClick={handleImport}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                开始导入
                            </button>
                        )}

                        {/* 导入进度和结果 */}
                        {importProgress && (
                            <div className={`p-4 rounded-xl ${importProgress.status === 'error' ? 'bg-red-50 border border-red-200' :
                                    importProgress.status === 'success' ? 'bg-green-50 border border-green-200' :
                                        importProgress.status === 'completed' ? 'bg-blue-50 border border-blue-200' :
                                            'bg-yellow-50 border border-yellow-200'
                                }`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">
                                        {importProgress.status === 'error' ? '❌' :
                                            importProgress.status === 'success' ? '✅' :
                                                importProgress.status === 'completed' ? '🎉' : '⏳'}
                                    </span>
                                    <p className={`font-medium ${importProgress.status === 'error' ? 'text-red-900' :
                                            importProgress.status === 'success' ? 'text-green-900' :
                                                importProgress.status === 'completed' ? 'text-blue-900' :
                                                    'text-yellow-900'
                                        }`}>
                                        {importProgress.message}
                                    </p>
                                </div>

                                {importProgress.status === 'success' && importProgress.data && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-green-700">预览前10个书签：</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {importProgress.data.map((bookmark: any, index: number) => (
                                                <div key={index} className="text-sm bg-white p-2 rounded border">
                                                    <div className="font-medium">{bookmark.title}</div>
                                                    <div className="text-gray-600">{bookmark.url}</div>
                                                    <div className="text-gray-500">分类: {bookmark.category}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={confirmImport}
                                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            确认导入
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 导出标签页 */}
                {activeTab === 'export' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 导出格式选择 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    导出格式
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'html', label: 'HTML格式', desc: '兼容Chrome等浏览器' },
                                        { value: 'json', label: 'JSON格式', desc: '结构化数据格式' },
                                        { value: 'csv', label: 'CSV格式', desc: '表格数据格式' }
                                    ].map(format => (
                                        <label key={format.value} className="flex items-center p-3 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="exportFormat"
                                                value={format.value}
                                                checked={exportFormat === format.value}
                                                onChange={(e) => setExportFormat(e.target.value as any)}
                                                className="mr-3"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{format.label}</div>
                                                <div className="text-sm text-gray-500">{format.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 导出筛选 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    筛选条件
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">分类</label>
                                        <select
                                            value={exportFilters.categoryId}
                                            onChange={(e) => setExportFilters({ ...exportFilters, categoryId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                        >
                                            <option value="all">所有分类</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={exportFilters.includeInactive}
                                                onChange={(e) => setExportFilters({ ...exportFilters, includeInactive: e.target.checked })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-600">包含失效书签</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleExport}
                            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            开始导出
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}