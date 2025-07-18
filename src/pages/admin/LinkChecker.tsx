import { useState, useEffect } from 'react'

interface Bookmark {
    id: number
    title: string
    url: string
    description?: string
    categoryId: number
    category?: { name: string }
    tags: string[]
    isActive: boolean
    lastChecked?: string
    status: 'active' | 'inactive' | 'error'
    createdAt: string
    updatedAt: string
}

interface CheckResult {
    bookmarkId: number
    status: 'active' | 'inactive' | 'error'
    responseTime?: number
    errorMessage?: string
}

export default function LinkChecker() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const [checking, setChecking] = useState(false)
    const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 })
    const [checkResults, setCheckResults] = useState<CheckResult[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [duplicateBookmarks, setDuplicateBookmarks] = useState<Bookmark[][]>([])
    const [showDuplicates, setShowDuplicates] = useState(false)

    useEffect(() => {
        fetchBookmarks()
        findDuplicates()
    }, [])

    const fetchBookmarks = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks?limit=1000`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            })
            const result = await response.json()
            if (result.success) {
                setBookmarks(result.data.bookmarks)
            }
        } catch (error) {
            console.error('获取书签失败:', error)
        } finally {
            setLoading(false)
        }
    }

    const findDuplicates = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/duplicates`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            })
            const result = await response.json()
            if (result.success) {
                setDuplicateBookmarks(result.data)
            }
        } catch (error) {
            console.error('查找重复书签失败:', error)
        }
    }

    const checkAllLinks = async () => {
        setChecking(true)
        setCheckProgress({ current: 0, total: bookmarks.length })
        setCheckResults([])

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/check-links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ bookmarkIds: bookmarks.map(b => b.id) })
            })

            const result = await response.json()
            if (result.success) {
                setCheckResults(result.data.results)
                await fetchBookmarks() // 刷新书签状态
                alert(`链接检查完成！检查了 ${result.data.results.length} 个链接`)
            } else {
                alert('链接检查失败: ' + result.error?.message)
            }
        } catch (error) {
            console.error('链接检查失败:', error)
            alert('链接检查失败，请重试')
        } finally {
            setChecking(false)
        }
    }

    const checkSingleLink = async (bookmarkId: number) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/check-links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ bookmarkIds: [bookmarkId] })
            })

            const result = await response.json()
            if (result.success) {
                await fetchBookmarks()
                alert('链接检查完成')
            } else {
                alert('链接检查失败: ' + result.error?.message)
            }
        } catch (error) {
            console.error('链接检查失败:', error)
            alert('链接检查失败，请重试')
        }
    }

    const deleteInactiveLinks = async () => {
        const inactiveBookmarks = bookmarks.filter(b => b.status === 'inactive' || b.status === 'error')

        if (inactiveBookmarks.length === 0) {
            alert('没有失效的链接需要删除')
            return
        }

        if (!confirm(`确定要删除 ${inactiveBookmarks.length} 个失效链接吗？此操作不可撤销。`)) {
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks/batch`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ ids: inactiveBookmarks.map(b => b.id) })
            })

            const result = await response.json()
            if (result.success) {
                await fetchBookmarks()
                alert(`成功删除 ${inactiveBookmarks.length} 个失效链接`)
            } else {
                alert('删除失败: ' + result.error?.message)
            }
        } catch (error) {
            console.error('删除失败:', error)
            alert('删除失败，请重试')
        }
    }

    const mergeDuplicates = async (duplicateGroup: Bookmark[], keepId: number) => {
        const toDelete = duplicateGroup.filter(b => b.id !== keepId)

        if (!confirm(`确定要合并这些重复书签吗？将保留选中的书签，删除其他 ${toDelete.length} 个重复项。`)) {
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks/batch`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ ids: toDelete.map(b => b.id) })
            })

            const result = await response.json()
            if (result.success) {
                await fetchBookmarks()
                await findDuplicates()
                alert(`成功合并重复书签，删除了 ${toDelete.length} 个重复项`)
            } else {
                alert('合并失败: ' + result.error?.message)
            }
        } catch (error) {
            console.error('合并失败:', error)
            alert('合并失败，请重试')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600'
            case 'inactive': return 'text-yellow-600'
            case 'error': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return '正常'
            case 'inactive': return '失效'
            case 'error': return '错误'
            default: return '未知'
        }
    }

    const filteredBookmarks = bookmarks.filter(bookmark => {
        if (filterStatus === 'all') return true
        return bookmark.status === filterStatus
    })

    const statusCounts = {
        total: bookmarks.length,
        active: bookmarks.filter(b => b.status === 'active').length,
        inactive: bookmarks.filter(b => b.status === 'inactive').length,
        error: bookmarks.filter(b => b.status === 'error').length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">加载中...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h2 className="text-3xl font-light text-gray-800 mb-2">链接管理</h2>
                <p className="text-gray-500">检查链接有效性，管理重复书签</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
                    <div className="text-gray-600">总书签数</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
                    <div className="text-gray-600">正常链接</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{statusCounts.inactive}</div>
                    <div className="text-gray-600">失效链接</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-red-600">{statusCounts.error}</div>
                    <div className="text-gray-600">错误链接</div>
                </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={checkAllLinks}
                        disabled={checking}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {checking ? '🔄 检查中...' : '🔍 检查所有链接'}
                    </button>
                    <button
                        onClick={deleteInactiveLinks}
                        disabled={statusCounts.inactive + statusCounts.error === 0}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        🗑️ 删除失效链接 ({statusCounts.inactive + statusCounts.error})
                    </button>
                    <button
                        onClick={() => setShowDuplicates(!showDuplicates)}
                        className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                    >
                        🔄 {showDuplicates ? '隐藏' : '显示'}重复书签 ({duplicateBookmarks.length})
                    </button>
                </div>

                {checking && (
                    <div className="mt-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(checkProgress.current / checkProgress.total) * 100}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600">
                                {checkProgress.current} / {checkProgress.total}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* 重复书签管理 */}
            {showDuplicates && duplicateBookmarks.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">重复书签管理</h3>
                        <p className="text-gray-500 mt-1">发现 {duplicateBookmarks.length} 组重复书签</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {duplicateBookmarks.map((group, groupIndex) => (
                            <div key={groupIndex} className="p-6">
                                <h4 className="font-medium text-gray-900 mb-3">
                                    重复组 {groupIndex + 1} ({group.length} 个书签)
                                </h4>
                                <div className="space-y-3">
                                    {group.map((bookmark) => (
                                        <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900">{bookmark.title}</h5>
                                                <p className="text-sm text-gray-600">{bookmark.url}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <span>📁 {bookmark.category?.name}</span>
                                                    <span>📅 {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => mergeDuplicates(group, bookmark.id)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                            >
                                                保留此项
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 筛选器 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: '全部', count: statusCounts.total },
                        { key: 'active', label: '正常', count: statusCounts.active },
                        { key: 'inactive', label: '失效', count: statusCounts.inactive },
                        { key: 'error', label: '错误', count: statusCounts.error }
                    ].map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setFilterStatus(filter.key)}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === filter.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* 书签列表 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                {filteredBookmarks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🔗</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">没有找到书签</h3>
                        <p className="text-gray-500">当前筛选条件下没有书签</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredBookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            {bookmark.title}
                                        </h3>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm break-all"
                                        >
                                            {bookmark.url}
                                        </a>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span>📁 {bookmark.category?.name || '未分类'}</span>
                                            <span className={getStatusColor(bookmark.status)}>
                                                ● {getStatusText(bookmark.status)}
                                            </span>
                                            {bookmark.lastChecked && (
                                                <span>🕒 上次检查: {new Date(bookmark.lastChecked).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => checkSingleLink(bookmark.id)}
                                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            🔍 检查
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}