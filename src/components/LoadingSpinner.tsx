interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

export default function LoadingSpinner({
    size = 'md',
    className = '',
    text
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
            {text && (
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            )}
        </div>
    )
}

// 页面级加载组件
export function PageLoading({ text = '加载中...' }: { text?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" text={text} />
        </div>
    )
}

// 内容区域加载组件
export function ContentLoading({ text = '加载中...' }: { text?: string }) {
    return (
        <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" text={text} />
        </div>
    )
}

// 按钮加载状态
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
    return <LoadingSpinner size={size} className="mr-2" />
}