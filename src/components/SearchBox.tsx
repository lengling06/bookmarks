import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface SearchBoxProps {
    onSearch?: (query: string) => void
    placeholder?: string
    className?: string
}

export default function SearchBox({
    onSearch,
    placeholder = "搜索书签...",
    className = ""
}: SearchBoxProps) {
    const [query, setQuery] = useState('')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    // 从URL参数初始化搜索词
    useEffect(() => {
        const q = searchParams.get('q')
        if (q) {
            setQuery(q)
        }
    }, [searchParams])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedQuery = query.trim()

        if (onSearch) {
            onSearch(trimmedQuery)
        } else {
            // 默认行为：导航到搜索页面
            if (trimmedQuery) {
                navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
            } else {
                navigate('/')
            }
        }
    }

    const handleClear = () => {
        setQuery('')
        if (onSearch) {
            onSearch('')
        } else {
            navigate('/')
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

                {/* 搜索图标 */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* 清除按钮 */}
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    )
}