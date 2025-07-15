import { Link } from 'react-router-dom'
import type { Category } from '../types'

interface CategoryCardProps {
    category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            to={`/category/${category.id}`}
            className="card hover:shadow-md transition-shadow group"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                </h3>
                <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {category.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                </p>
            )}

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {category.bookmarkCount || 0} 个书签
                </div>

                <div className="flex items-center text-primary-600 text-sm font-medium">
                    查看书签
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}