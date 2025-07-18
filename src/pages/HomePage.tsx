import { useState, useEffect } from 'react'
import { useCategories, useCategoryBookmarks, useSearchBookmarks } from '../hooks/useApi'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const { data: categories, isLoading: categoriesLoading, error } = useCategories()
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [isTransitioning, setIsTransitioning] = useState(false)
    const navigate = useNavigate()

    // 当分类加载完成后，默认选择第一个分类
    useEffect(() => {
        if (categories && categories.length > 0 && selectedCategory === null) {
            setSelectedCategory(categories[0].id)
        }
    }, [categories, selectedCategory])

    // 获取书签数据 - 增加限制到1000以获取所有书签
    const { data: categoryBookmarks } = useCategoryBookmarks(
        selectedCategory || 0,
        1,
        1000
    )

    const { data: searchResults } = useSearchBookmarks({
        q: searchQuery,
        page: 1,
        limit: 100
    })

    // 处理分类切换 - 立即响应，无延迟
    const handleCategoryChange = (categoryId: number) => {
        if (categoryId !== selectedCategory) {
            setSelectedCategory(categoryId)
        }
    }

    // 更新书签显示
    useEffect(() => {
        if (searchQuery) {
            setBookmarks(searchResults?.bookmarks || [])
        } else if (categoryBookmarks) {
            setBookmarks(categoryBookmarks.bookmarks || [])
        }
    }, [searchQuery, searchResults, selectedCategory, categoryBookmarks])

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
                <header className="text-center mb-12 animate-fade-in-down">
                    <div className="inline-block mb-6">
                        {/* 新的优雅图标 - 书签与墨滴的结合 */}
                        <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-sm">
                            <defs>
                                <linearGradient id="bookmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82c4" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
                                </linearGradient>
                            </defs>
                            {/* 书签形状 */}
                            <path d="M20 8 C18 8 16 10 16 12 L16 52 C16 54 18 56 20 56 L32 48 L44 56 C46 56 48 54 48 52 L48 12 C48 10 46 8 44 8 Z"
                                fill="url(#bookmarkGradient)" stroke="none" />
                            {/* 墨滴装饰 */}
                            <circle cx="32" cy="24" r="3" fill="white" opacity="0.9" />
                            <path d="M32 20 Q28 24 32 28 Q36 24 32 20" fill="white" opacity="0.7" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-light tracking-widest mb-3 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                        墨韵
                    </h1>
                    <p className="text-gray-500 tracking-wider">静水流深 · 见素抱朴</p>
                </header>

                {/* 搜索框 */}
                <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full px-6 py-4 pl-12 text-base border border-gray-200 rounded-full bg-white 
                                     transition-all duration-300 shadow-sm
                                     focus:outline-none focus:border-blue-500 focus:shadow-md focus:shadow-blue-100"
                            placeholder="搜索书签..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* 主要内容区域 - 左右布局 */}
                <div className="flex gap-8 animate-fade-in">
                    {/* 左侧分类导航 */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-8">
                            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 11H5m14-7l2 2-2 2m2-2H9m10 7l2 2-2 2" />
                                </svg>
                                分类导航
                            </h2>
                            <nav className="space-y-2">
                                {categories?.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer 
                                                  transition-all duration-300 hover:bg-blue-50
                                                  ${selectedCategory === category.id ?
                                                'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' :
                                                'text-gray-600 hover:text-blue-600'}`}
                                        onClick={() => handleCategoryChange(category.id)}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-3 transition-colors duration-300
                                                          ${selectedCategory === category.id ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-blue-400'}`}></div>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300
                                                        ${selectedCategory === category.id ?
                                                'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                            {category.bookmarkCount || 0}
                                        </span>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* 右侧书签展示区域 */}
                    <main className="flex-1 min-w-0">
                        {/* 当前分类标题 */}
                        {selectedCategory && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-light text-gray-800 mb-2">
                                    {categories?.find(c => c.id === selectedCategory)?.name}
                                </h2>
                                <p className="text-gray-500">
                                    {categories?.find(c => c.id === selectedCategory)?.description}
                                </p>
                            </div>
                        )}

                        {/* 书签网格 - 响应式网格布局 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {bookmarks.map((bookmark, index) => (
                                <BookmarkCard
                                    key={`${selectedCategory}-${bookmark.id}`}
                                    bookmark={bookmark}
                                    index={index}
                                />
                            ))}
                        </div>
                    </main>
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
function BookmarkCard({ bookmark, index }: { bookmark: any; index: number }) {
    const handleClick = () => {
        window.open(bookmark.url, '_blank')
    }

    // 获取网站图标
    const getFavicon = (url: string) => {
        try {
            const domain = new URL(url).origin
            return `${domain}/favicon.ico`
        } catch {
            return null
        }
    }

    // 根据分类获取图标
    const getCategoryIcon = (url: string, title: string) => {
        const urlLower = url.toLowerCase()
        const titleLower = title.toLowerCase()

        if (urlLower.includes('github.com')) return '🐙'
        if (urlLower.includes('bilibili.com')) return '📺'
        if (urlLower.includes('youtube.com')) return '🎬'
        if (urlLower.includes('zhihu.com')) return '🤔'
        if (urlLower.includes('csdn.net')) return '💻'
        if (urlLower.includes('juejin.cn')) return '💎'
        if (urlLower.includes('stackoverflow.com')) return '📚'
        if (urlLower.includes('runoob.com')) return '🎓'
        if (urlLower.includes('w3school')) return '📖'
        if (urlLower.includes('mdn.mozilla.org')) return '🌐'
        if (urlLower.includes('cloudflare.com')) return '☁️'
        if (urlLower.includes('vercel.com')) return '▲'
        if (urlLower.includes('openai.com') || titleLower.includes('chatgpt')) return '🤖'
        if (urlLower.includes('mail') || titleLower.includes('邮箱')) return '📧'
        if (titleLower.includes('api')) return '🔌'
        if (titleLower.includes('工具') || titleLower.includes('tool')) return '🛠️'
        if (titleLower.includes('文档') || titleLower.includes('docs')) return '📄'
        if (titleLower.includes('教程') || titleLower.includes('tutorial')) return '📚'
        if (titleLower.includes('下载') || titleLower.includes('download')) return '⬇️'
        if (titleLower.includes('音乐') || titleLower.includes('music')) return '🎵'
        if (titleLower.includes('视频') || titleLower.includes('video')) return '🎥'
        if (titleLower.includes('游戏') || titleLower.includes('game')) return '🎮'
        if (titleLower.includes('域名') || titleLower.includes('domain')) return '🌍'

        return '🔗'
    }

    const favicon = getFavicon(bookmark.url)
    const categoryIcon = getCategoryIcon(bookmark.url, bookmark.title)

    return (
        <div
            className="bg-white rounded-2xl p-5 border border-gray-200 cursor-pointer relative overflow-hidden
                     transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-transparent
                     before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-0 
                     before:bg-blue-600 before:transition-all before:duration-300 hover:before:h-full
                     h-32 flex flex-col" // 固定高度，使用flex布局
            onClick={handleClick}
            style={{
                animationDelay: `${index * 30}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 30}ms both`
            }}
        >
            {/* 头部：图标和标题 */}
            <div className="flex items-start gap-3 mb-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 
                              flex items-center justify-center text-lg flex-shrink-0 border border-blue-100">
                    {favicon ? (
                        <img
                            src={favicon}
                            alt=""
                            className="w-5 h-5"
                            onError={(e) => {
                                // 如果favicon加载失败，显示分类图标
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling!.style.display = 'block'
                            }}
                        />
                    ) : null}
                    <span className={favicon ? 'hidden' : 'block'}>{categoryIcon}</span>
                </div>
                <div className="flex-1 min-w-0"> {/* min-w-0 确保文本可以被截断 */}
                    <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-2 leading-tight">
                        {bookmark.title}
                    </h3>
                </div>
            </div>

            {/* 底部：描述和标签 */}
            <div className="mt-auto">
                {bookmark.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                        {bookmark.description}
                    </p>
                )}

                {/* 标签 */}
                {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {bookmark.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <span
                                key={tagIndex}
                                className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 
                                         rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                        {bookmark.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{bookmark.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            {/* 悬浮时显示的URL提示 */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md max-w-32 truncate">
                    {new URL(bookmark.url).hostname}
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