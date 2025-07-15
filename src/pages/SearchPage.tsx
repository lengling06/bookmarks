import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearchBookmarks } from '../hooks/useApi'
import BookmarkCard from '../components/BookmarkCard'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const [page, setPage] = useState(1)
    const query = searchParams.get('q') || ''

    const { data, isLoading, error } = useSearchBookmarks({
        q: query,
        page,
        limit: 20
    })

    // 重置页码当搜索词改变时
    useEffect(() => {
        setPage(1)
    }, [query])

    const handleSearch = (newQuery: string) => {
        // SearchBox组件会处理导航
    }

    if (!query.trim()) {
        return (
            <div className="container mx-auto px-4 py-8">
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

                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        搜索书签
                    </h1>
                    <SearchBox onSearch={handleSearch} />
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="mb-6">
                        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                    </div>
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="mb-4">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
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

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    title="搜索失败"
                    description="无法执行搜索，请稍后重试"
                    action={
                        <Link to="/" className="btn-primary">
                            返回首页
                        </Link>
                    }
                />
            </div>
        )
    }

    const { bookmarks, pagination } = data || { bookmarks: [], pagination: { total: 0, totalPages: 0 } }

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

            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto mb-8">
                <SearchBox onSearch={handleSearch} />
            </div>

            {/* 搜索结果标题 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    搜索结果
                </h1>
                <p className="text-gray-600 mt-1">
                    关键词 "{query}" 共找到 {pagination.total} 个结果
                </p>
            </div>

            {/* 搜索结果 */}
            {bookmarks && bookmarks.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {bookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark.id}
                                bookmark={bookmark}
                                showCategory={true}
                            />
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
                    icon={
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                    title="未找到相关书签"
                    description={`没有找到包含 "${query}" 的书签，请尝试其他关键词`}
                    action={
                        <button
                            onClick={() => handleSearch('')}
                            className="btn-secondary"
                        >
                            清除搜索
                        </button>
                    }
                />
            )}
        </div>
    )
}