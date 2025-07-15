import type { Bookmark } from '../types'

interface BookmarkCardProps {
    bookmark: Bookmark
    showCategory?: boolean
}

export default function BookmarkCard({ bookmark, showCategory = false }: BookmarkCardProps) {
    const handleClick = () => {
        window.open(bookmark.url, '_blank', 'noopener,noreferrer')
    }

    return (
        <div
            onClick={handleClick}
            className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {bookmark.title}
                </h3>
                <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </div>

            {bookmark.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {bookmark.description}
                </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="truncate">
                    {new URL(bookmark.url).hostname}
                </span>

                {showCategory && bookmark.category && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0">
                        {bookmark.category.name}
                    </span>
                )}
            </div>

            {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {bookmark.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                    {bookmark.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                            +{bookmark.tags.length - 3}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}