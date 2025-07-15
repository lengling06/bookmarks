interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    const defaultIcon = (
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )

    return (
        <div className="text-center py-12">
            <div className="mb-4">
                {icon || defaultIcon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    )
}