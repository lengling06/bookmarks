import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCategoryBookmarks } from '../hooks/useApi'
import BookmarkCard from '../components/BookmarkCard'
import EmptyState from '../components/EmptyState'

export default function CategoryPage() {
    const { id } = useParams<{ id: string }>()
    const [page, setPage] = useState(1)
    const categoryId = parseInt(id || '0')

    const { data, isLoading, error } = useCategoryBookmarks(categoryId, page, 20)

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="mb-6">
                        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                    </div>
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-40 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title="加载失败"
                    description="无法加载书签数据，请稍后重试"
                    action={
                        <Link to="/" className="btn-primary">
                            返回首页
                        </Link>
                    }
                />
            </div>
        )
    }

    const bookmarks = data?.bookmarks || []
    const pagination = data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 0 }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 返回按钮 */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    返回首页
                </Link>
            </div>

            {/* 分类标题 */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    分类书签
                </h1>
                <p className="text-gray-600">
                    共 {pagination.total} 个书签
                </p>
            </header>

            {/* 书签列表 */}
            {bookmarks && bookmarks.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {bookmarks.map((bookmark) => (
                            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                        ))}
                    </div>

                    {/* 分页 */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                上一页
                            </button>

                            <span className="px-3 py-2 text-sm text-gray-700">
                                第 {page} 页，共 {pagination.totalPages} 页
                            </span>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= pagination.totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                下一页
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyState
                    title="暂无书签"
                    description="这个分类还没有添加任何书签"
                    action={
                        <Link to="/" className="btn-primary">
                            浏览其他分类
                        </Link>
                    }
                />
            )}
        </div>
    )
}