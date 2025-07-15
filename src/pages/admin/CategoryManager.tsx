import { useState, useEffect } from 'react'

export default function CategoryManager() {
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // 获取分类数据
    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            // 这里应该调用API获取数据，暂时使用模拟数据
            const mockCategories = [
                {
                    id: 1,
                    name: '开发工具',
                    description: '编程和开发相关的工具和资源',
                    sortOrder: 1,
                    bookmarkCount: 15,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01'
                },
                {
                    id: 2,
                    name: '设计资源',
                    description: 'UI/UX设计工具和素材网站',
                    sortOrder: 2,
                    bookmarkCount: 8,
                    createdAt: '2024-01-02',
                    updatedAt: '2024-01-02'
                },
                {
                    id: 3,
                    name: '学习资料',
                    description: '在线课程和教程网站',
                    sortOrder: 3,
                    bookmarkCount: 12,
                    createdAt: '2024-01-03',
                    updatedAt: '2024-01-03'
                },
            ]
            setCategories(mockCategories)
        } catch (error) {
            console.error('获取分类失败:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDeleteCategory = (id: number) => {
        const category = categories.find(c => c.id === id)
        if (category && category.bookmarkCount > 0) {
            const action = confirm(`分类"${category.name}"下有${category.bookmarkCount}个书签。\n\n点击"确定"删除分类和所有书签\n点击"取消"保留分类`)
            if (!action) return
        } else if (!confirm(`确定要删除分类"${category?.name}"吗？`)) {
            return
        }

        setCategories(categories.filter(c => c.id !== id))
    }

    const handleMoveCategory = (id: number, direction: 'up' | 'down') => {
        const currentIndex = categories.findIndex(c => c.id === id)
        if (currentIndex === -1) return

        const newCategories = [...categories]
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

        if (targetIndex < 0 || targetIndex >= newCategories.length) return

        // 交换位置
        [newCategories[currentIndex], newCategories[targetIndex]] =
            [newCategories[targetIndex], newCategories[currentIndex]]

        // 更新排序
        newCategories.forEach((cat, index) => {
            cat.sortOrder = index + 1
        })

        setCategories(newCategories)
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-light text-gray-800 mb-2">分类管理</h2>
                    <p className="text-gray-500">管理书签分类的创建、编辑和排序</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                    <span className="mr-2">➕</span>
                    添加分类
                </button>
            </div>

            {/* 搜索框 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <input
                    type="text"
                    placeholder="搜索分类名称或描述..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                />
            </div>

            {/* 分类列表 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredCategories.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {filteredCategories.map((category, index) => (
                            <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* 排序控制 */}
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleMoveCategory(category.id, 'up')}
                                                disabled={index === 0}
                                                className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-green-600'} transition-colors`}
                                                title="上移"
                                            >
                                                ⬆️
                                            </button>
                                            <button
                                                onClick={() => handleMoveCategory(category.id, 'down')}
                                                disabled={index === filteredCategories.length - 1}
                                                className={`p-1 rounded ${index === filteredCategories.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-green-600'} transition-colors`}
                                                title="下移"
                                            >
                                                ⬇️
                                            </button>
                                        </div>

                                        {/* 分类图标 */}
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-xl">
                                            📁
                                        </div>

                                        {/* 分类信息 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {category.name}
                                                </h3>
                                                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                                                    排序: {category.sortOrder}
                                                </span>
                                                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                                    {category.bookmarkCount} 个书签
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {category.description || '暂无描述'}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>📅 创建于 {new Date(category.createdAt).toLocaleDateString()}</span>
                                                <span>🔄 更新于 {new Date(category.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => setEditingCategory(category)}
                                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                            title="编辑"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="删除"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分类</h3>
                        <p className="text-gray-500 mb-6">还没有创建任何分类，点击上方按钮开始添加</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            创建第一个分类
                        </button>
                    </div>
                )}
            </div>

            {/* 添加/编辑分类模态框 */}
            {(showAddModal || editingCategory) && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setShowAddModal(false)
                        setEditingCategory(null)
                    }}
                    onSave={(categoryData) => {
                        if (editingCategory) {
                            // 编辑分类
                            setCategories(categories.map(c =>
                                c.id === editingCategory.id ? { ...c, ...categoryData, updatedAt: new Date().toISOString() } : c
                            ))
                        } else {
                            // 添加新分类
                            const newCategory = {
                                id: Date.now(),
                                ...categoryData,
                                sortOrder: categories.length + 1,
                                bookmarkCount: 0,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            }
                            setCategories([...categories, newCategory])
                        }
                        setShowAddModal(false)
                        setEditingCategory(null)
                    }}
                />
            )}
        </div>
    )
}

// 分类添加/编辑模态框组件
function CategoryModal({ category, onClose, onSave }: {
    category?: any
    onClose: () => void
    onSave: (data: any) => void
}) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 基本验证
        if (!formData.name.trim()) {
            alert('请填写分类名称')
            return
        }

        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-gray-900">
                        {category ? '编辑分类' : '添加分类'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            分类名称 *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="请输入分类名称"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            分类描述
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                            placeholder="请输入分类描述（可选）"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            {category ? '保存修改' : '添加分类'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}