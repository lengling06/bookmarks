import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useApi'

// 管理员仪表板组件
const Dashboard = () => {
    const { data: stats, isLoading } = useAdminStats()

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-200 rounded-2xl"></div>
                    <div className="h-80 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* 欢迎标题 */}
            <div className="mb-8">
                <h2 className="text-3xl font-light text-gray-800 mb-2">管理仪表板</h2>
                <p className="text-gray-500">书签系统运行状态一览</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="总书签数"
                    value={stats?.overview?.totalBookmarks || 0}
                    icon="📚"
                    color="blue"
                />
                <StatCard
                    title="分类数量"
                    value={stats?.overview?.totalCategories || 0}
                    icon="📁"
                    color="green"
                />
                <StatCard
                    title="活跃书签"
                    value={stats?.overview?.activeBookmarks || 0}
                    icon="✅"
                    color="emerald"
                />
                <StatCard
                    title="失效书签"
                    value={stats?.overview?.inactiveBookmarks || 0}
                    icon="⚠️"
                    color="amber"
                />
            </div>

            {/* 详细信息区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 最近添加的书签 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <span className="mr-2">🕒</span>
                            最近添加的书签
                        </h3>
                        <Link to="/admin/bookmarks" className="text-blue-600 hover:text-blue-700 text-sm">
                            查看全部 →
                        </Link>
                    </div>
                    {stats?.recentBookmarks && stats.recentBookmarks.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentBookmarks.slice(0, 6).map((bookmark: any) => (
                                <div key={bookmark.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm">
                                        🔗
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {bookmark.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {bookmark.category} • {new Date(bookmark.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">📝</div>
                            <p className="text-gray-500 text-sm">暂无书签</p>
                        </div>
                    )}
                </div>

                {/* 系统状态 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <span className="mr-2">📊</span>
                            系统状态
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">API服务</span>
                            </div>
                            <span className="text-xs text-green-600 font-medium">正常运行</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">数据库</span>
                            </div>
                            <span className="text-xs text-green-600 font-medium">连接正常</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">最后更新</span>
                            </div>
                            <span className="text-xs text-blue-600 font-medium">
                                {stats?.generatedAt ? new Date(stats.generatedAt).toLocaleString() : '刚刚'}
                            </span>
                        </div>
                    </div>

                    {/* 快速操作 */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">快速操作</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/admin/bookmarks"
                                className="flex items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 text-sm font-medium"
                            >
                                <span className="mr-2">➕</span>
                                添加书签
                            </Link>
                            <Link
                                to="/admin/import-export"
                                className="flex items-center justify-center p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-green-700 text-sm font-medium"
                            >
                                <span className="mr-2">📥</span>
                                导入书签
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 统计卡片组件
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 text-blue-600',
        green: 'from-green-500 to-green-600 text-green-600',
        emerald: 'from-emerald-500 to-emerald-600 text-emerald-600',
        amber: 'from-amber-500 to-amber-600 text-amber-600',
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-light ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]}`}>
                        {value.toLocaleString()}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} flex items-center justify-center text-white text-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

const BookmarkManager = () => {
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingBookmark, setEditingBookmark] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // 获取书签和分类数据
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            // 获取书签数据
            const bookmarksResponse = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks?search=${searchQuery}&categoryId=${selectedCategory}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            })
            const bookmarksResult = await bookmarksResponse.json()

            // 获取分类数据
            const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/categories`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            })
            const categoriesResult = await categoriesResponse.json()

            if (bookmarksResult.success) {
                setBookmarks(bookmarksResult.data.bookmarks || [])
            }
            if (categoriesResult.success) {
                setCategories(categoriesResult.data || [])
            }
        } catch (error) {
            console.error('获取数据失败:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredBookmarks = bookmarks.filter(bookmark => {
        const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || bookmark.categoryId.toString() === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleDeleteBookmark = async (id: number) => {
        if (confirm('确定要删除这个书签吗？')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                    }
                })
                const result = await response.json()
                if (result.success) {
                    setBookmarks(bookmarks.filter(b => b.id !== id))
                    alert('书签删除成功')
                } else {
                    alert('删除失败: ' + result.error?.message)
                }
            } catch (error: any) {
                console.error('删除书签失败:', error)
                alert('删除失败: ' + error.message)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-light text-gray-800 mb-2">书签管理</h2>
                    <p className="text-gray-500">管理所有书签的添加、编辑和删除</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <span className="mr-2">➕</span>
                    添加书签
                </button>
            </div>

            {/* 搜索和筛选 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="搜索书签标题或描述..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="all">所有分类</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 书签列表 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredBookmarks.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {filteredBookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl">
                                            🔗
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {bookmark.title}
                                                </h3>
                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                    {bookmark.category}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                {bookmark.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>🔗 {bookmark.url}</span>
                                                <span>📅 {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                                                <div className="flex gap-1">
                                                    {bookmark.tags.map((tag: string) => (
                                                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => window.open(bookmark.url, '_blank')}
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="访问链接"
                                        >
                                            🔗
                                        </button>
                                        <button
                                            onClick={() => setEditingBookmark(bookmark)}
                                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                            title="编辑"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBookmark(bookmark.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="删除"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无书签</h3>
                        <p className="text-gray-500 mb-6">还没有添加任何书签，点击上方按钮开始添加</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            添加第一个书签
                        </button>
                    </div>
                )}
            </div>

            {/* 添加/编辑书签模态框 */}
            {(showAddModal || editingBookmark) && (
                <BookmarkModal
                    bookmark={editingBookmark}
                    categories={categories}
                    onClose={() => {
                        setShowAddModal(false)
                        setEditingBookmark(null)
                    }}
                    onSave={async (bookmarkData) => {
                        try {
                            if (editingBookmark) {
                                // 编辑书签
                                const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks/${editingBookmark.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                                    },
                                    body: JSON.stringify({
                                        title: bookmarkData.title,
                                        url: bookmarkData.url,
                                        description: bookmarkData.description,
                                        categoryId: bookmarkData.categoryId,
                                        tags: bookmarkData.tags
                                    })
                                })
                                const result = await response.json()
                                if (result.success) {
                                    setBookmarks(bookmarks.map(b =>
                                        b.id === editingBookmark.id ? { ...b, ...bookmarkData } : b
                                    ))
                                    alert('书签更新成功')
                                } else {
                                    alert('更新失败: ' + result.error?.message)
                                    return
                                }
                            } else {
                                // 添加新书签
                                const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                                    },
                                    body: JSON.stringify({
                                        title: bookmarkData.title,
                                        url: bookmarkData.url,
                                        description: bookmarkData.description,
                                        categoryId: bookmarkData.categoryId,
                                        tags: bookmarkData.tags
                                    })
                                })
                                const result = await response.json()
                                if (result.success) {
                                    // 重新获取书签列表以获取最新数据
                                    await fetchData()
                                    alert('书签添加成功')
                                } else {
                                    alert('添加失败: ' + result.error?.message)
                                    return
                                }
                            }
                            setShowAddModal(false)
                            setEditingBookmark(null)
                        } catch (error: any) {
                            console.error('保存书签失败:', error)
                            alert('保存失败: ' + error.message)
                        }
                    }}
                />
            )}
        </div>
    )
}

// 书签添加/编辑模态框组件
function BookmarkModal({ bookmark, categories, onClose, onSave }: {
    bookmark?: any
    categories: any[]
    onClose: () => void
    onSave: (data: any) => void
}) {
    const [formData, setFormData] = useState({
        title: bookmark?.title || '',
        url: bookmark?.url || '',
        description: bookmark?.description || '',
        categoryId: bookmark?.categoryId || categories[0]?.id || '',
        tags: bookmark?.tags?.join(', ') || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 基本验证
        if (!formData.title.trim() || !formData.url.trim()) {
            alert('请填写标题和URL')
            return
        }

        // 处理标签
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        const categoryName = categories.find(c => c.id.toString() === formData.categoryId.toString())?.name

        onSave({
            ...formData,
            categoryId: parseInt(formData.categoryId.toString()),
            category: categoryName,
            tags
        })
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-gray-900">
                        {bookmark ? '编辑书签' : '添加书签'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            标题 *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="请输入书签标题"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL *
                        </label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="https://example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            描述
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="请输入书签描述"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            分类
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            标签
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="用逗号分隔多个标签，如：开发,工具,GitHub"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            {bookmark ? '保存修改' : '添加书签'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// 导入新创建的组件
import CategoryManagerComponent from './CategoryManager'
import ImportExportComponent from './ImportExport'

const CategoryManager = () => <CategoryManagerComponent />
const ImportExport = () => <ImportExportComponent />

export default function AdminDashboard() {
    const location = useLocation()

    const navigation = [
        { name: '仪表板', href: '/admin', current: location.pathname === '/admin' },
        { name: '书签管理', href: '/admin/bookmarks', current: location.pathname === '/admin/bookmarks' },
        { name: '分类管理', href: '/admin/categories', current: location.pathname === '/admin/categories' },
        { name: '导入导出', href: '/admin/import-export', current: location.pathname === '/admin/import-export' },
    ]

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        window.location.href = '/admin/login'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">书签管理后台</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-500 hover:text-gray-700">
                                查看网站
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                退出登录
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* 侧边栏 */}
                <div className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="mt-8">
                        <div className="px-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`${item.current
                                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* 主内容区 */}
                <div className="flex-1 p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/bookmarks" element={<BookmarkManager />} />
                        <Route path="/categories" element={<CategoryManager />} />
                        <Route path="/import-export" element={<ImportExport />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}