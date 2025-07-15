import React from 'react'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)

        // 这里可以发送错误到监控服务
        // ErrorMonitor.recordError({
        //   error: error.message,
        //   stack: error.stack,
        //   timestamp: new Date().toISOString(),
        //   endpoint: 'client-error',
        //   method: 'RENDER'
        // })
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback
            return <FallbackComponent error={this.state.error} resetError={this.resetError} />
        }

        return this.props.children
    }
}

// 默认错误回退组件
function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        出现了一些问题
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        页面遇到了意外错误，请尝试刷新页面
                    </p>
                    {error && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                查看错误详情
                            </summary>
                            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={resetError}
                        className="btn-primary w-full"
                    >
                        重试
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn-secondary w-full"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorBoundary