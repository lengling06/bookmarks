import { useState, useEffect } from 'react'
import { useCategories, useCategoryBookmarks, useSearchBookmarks } from '../hooks/useApi'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const { data: categories, isLoading: categoriesLoading, error } = useCategories()
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const navigate = useNavigate()

    // 获取书签数据
    const { data: categoryBookmarks } = useCategoryBookmarks(
        selectedCategory !== 'all' ? selectedCategory as number : 0,
        1,
        20
    )

    const { data: searchResults } = useSearchBookmarks({
        q: searchQuery,
        page: 1,
        limit: 20
    })

    // 更新书签显示
    useEffect(() => {
        if (searchQuery) {
            setBookmarks(searchResults?.bookmarks || [])
        } else if (selectedCategory === 'all') {
            // 获取所有书签
            const allBookmarks: any[] = []
            categories?.forEach(category => {
                // 这里需要获取每个分类的书签，暂时显示空
            })
            setBookmarks([])
        } else if (categoryBookmarks) {
            setBookmarks(categoryBookmarks.bookmarks || [])
        }
    }, [searchQuery, searchResults, selectedCategory, categoryBookmarks, categories])

    if (categoriesLoading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState />
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* 背景装饰 */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="bamboo" style={{ left: '10%', height: '40%', top: '20%' }}></div>
                <div className="bamboo" style={{ left: '85%', height: '50%', top: '30%' }}></div>
                <div className="bamboo" style={{ left: '93%', height: '35%', top: '50%' }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-5 py-10">
                {/* 头部 */}
                <header className="text-center mb-15 animate-fade-in-down">
                    <div className="inline-block mb-5">
                        <svg width="60" height="60" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="28" fill="none" stroke="#3b82c4" strokeWidth="1" opacity="0.5" />
                            <path d="M30 10 Q20 25 25 30 Q30 35 30 50 M30 10 Q40 25 35 30 Q30 35 30 50"
                                fill="none" stroke="#3b82c4" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-light tracking-widest mb-3 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                        墨韵
                    </h1>
                    <p className="text-gray-500 tracking-wider">静水流深 · 见素抱朴</p>
                </header>

                {/* 搜索框 */}
                <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
                    <input
                        type="text"
                        className="w-full px-6 py-4 text-base border border-gray-200 rounded-full bg-white 
                                 transition-all duration-300 shadow-sm
                                 focus:outline-none focus:border-blue-500 focus:shadow-md focus:shadow-blue-100"
                        placeholder="搜索书签..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* 分类导航 */}
                <nav className="flex justify-center gap-8 mb-12 flex-wrap animate-fade-in">
                    <div
                        className={`px-6 py-2 cursor-pointer relative text-gray-500 transition-colors duration-300
                                  ${selectedCategory === 'all' ? 'text-blue-600' : 'hover:text-blue-600'}
                                  after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 
                                  after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 
                                  after:transform after:-translate-x-1/2
                                  ${selectedCategory === 'all' ? 'after:w-full' : 'hover:after:w-full'}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        全部
                    </div>
                    {categories?.map((category) => (
                        <div
                            key={category.id}
                            className={`px-6 py-2 cursor-pointer relative text-gray-500 transition-colors duration-300
                                      ${selectedCategory === category.id ? 'text-blue-600' : 'hover:text-blue-600'}
                                      after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 
                                      after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 
                                      after:transform after:-translate-x-1/2
                                      ${selectedCategory === category.id ? 'after:w-full' : 'hover:after:w-full'}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </div>
                    ))}
                </nav>

                {/* 书签网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {bookmarks.map((bookmark) => (
                        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                    ))}
                </div>

                {/* 空状态 */}
                {bookmarks.length === 0 && !searchQuery && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">暂无书签</p>
                        <p className="text-gray-400 mt-2">请选择分类或搜索书签</p>
                    </div>
                )}

                {/* 搜索无结果 */}
                {bookmarks.length === 0 && searchQuery && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">未找到相关书签</p>
                        <p className="text-gray-400 mt-2">尝试使用其他关键词搜索</p>
                    </div>
                )}
            </div>

            {/* 管理员入口 */}
            <div
                className="fixed bottom-5 right-5 w-10 h-10 rounded-full bg-white border border-gray-200 
                         flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 
                         transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={() => navigate('/admin/login')}
                title="管理员入口"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m4.22-10.22l1.42 1.42M6.34 6.34l1.42 1.42m12.02 7.88l-1.42 1.42M6.34 17.66l-1.42-1.42"></path>
                </svg>
            </div>
        </div>
    )
}

// 书签卡片组件
function BookmarkCard({ bookmark }: { bookmark: any }) {
    const handleClick = () => {
        window.open(bookmark.url, '_blank')
    }

    return (
        <div
            className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer relative overflow-hidden
                     transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-transparent
                     before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-0 
                     before:bg-blue-600 before:transition-all before:duration-300 hover:before:h-full"
            onClick={handleClick}
        >
            <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 
                              flex items-center justify-center text-2xl">
                    🔗
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{bookmark.title}</h3>
                    {bookmark.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{bookmark.description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

// 加载状态组件
function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">加载中...</p>
            </div>
        </div>
    )
}

// 错误状态组件
function ErrorState() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">加载失败</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    重新加载
                </button>
            </div>
        </div>
    )
}