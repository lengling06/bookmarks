import { useCategories } from '../hooks/useApi'
import CategoryCard from '../components/CategoryCard'
import SearchBox from '../components/SearchBox'
import EmptyState from '../components/EmptyState'

export default function HomePage() {
    const { data: categories, isLoading, error } = useCategories()

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="text-center mb-8">
                        <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
                    </div>
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
                    title="加载失败"
                    description="无法加载分类数据，请稍后重试"
                    action={
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            重新加载
                        </button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    书签管理系统
                </h1>
                <p className="text-gray-600 text-lg">
                    发现和管理你的书签收藏
                </p>
            </header>

            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto mb-8">
                <SearchBox />
            </div>

            {/* 分类展示区域 */}
            {categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="暂无分类"
                    description="还没有任何书签分类，请联系管理员添加书签"
                />
            )}
        </div>
    )
}