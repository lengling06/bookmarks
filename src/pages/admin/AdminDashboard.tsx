import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useApi'

// 临时组件，后续会替换为实际组件
const Dashboard = () => {
    const { data: stats, isLoading } = useAdminStats()

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">仪表板</h2>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">总书签数</h3>
                    <div className="text-3xl font-bold text-primary-600">
                        {stats?.overview?.totalBookmarks || 0}
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">分类数</h3>
                    <div className="text-3xl font-bold text-primary-600">
                        {stats?.overview?.totalCategories || 0}
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">活跃书签</h3>
                    <div className="text-3xl font-bold text-green-600">
                        {stats?.overview?.activeBookmarks || 0}
                    </div>
                </div>
            </div>

            {/* 最近书签和分类分布 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">最近添加的书签</h3>
                    {stats?.recentBookmarks && stats.recentBookmarks.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentBookmarks.slice(0, 5).map((bookmark: any) => (
                                <div key={bookmark.id} className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {bookmark.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {bookmark.category}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(bookmark.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">暂无书签</p>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">分类分布</h3>
                    {stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                        <div className="space-y-3">
                            {stats.categoryDistribution.slice(0, 5).map((category: any) => (
                                <div key={category.categoryId} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-900">
                                        {category.categoryName || '未分类'}
                                    </span>
                                    <span className="text-sm font-medium text-primary-600">
                                        {category.bookmarkCount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">暂无数据</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const BookmarkManager = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">书签管理</h2>
        <p className="text-gray-600">书签管理功能开发中...</p>
    </div>
)

const CategoryManager = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">分类管理</h2>
        <p className="text-gray-600">分类管理功能开发中...</p>
    </div>
)

const ImportExport = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">导入导出</h2>
        <p className="text-gray-600">导入导出功能开发中...</p>
    </div>
)

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