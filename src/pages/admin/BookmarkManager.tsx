import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  description?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface Bookmark {
  id: number
  title: string
  url: string
  description?: string
  categoryId: number
  category?: Category
  tags: string[]
  isActive: boolean
  lastChecked?: string
  status: 'active' | 'inactive' | 'error'
  createdAt: string
  updatedAt: string
}

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: 0,
    tags: ''
  })

  const itemsPerPage = 20

  useEffect(() => {
    fetchBookmarksAndCategories()
  }, [currentPage, searchTerm, filterCategory])

  const fetchBookmarksAndCategories = async () => {
    try {
      // 获取分类
      const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      const categoriesResult = await categoriesResponse.json()
      if (categoriesResult.success) {
        setCategories(categoriesResult.data)
      }

      // 获取书签
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        category: filterCategory
      })

      const bookmarksResponse = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      const bookmarksResult = await bookmarksResponse.json()
      if (bookmarksResult.success) {
        setBookmarks(bookmarksResult.data.bookmarks)
        setTotalPages(Math.ceil(bookmarksResult.data.total / itemsPerPage))
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingBookmark
        ? `${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks/${editingBookmark.id}`
        : `${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks`

      const method = editingBookmark ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      })

      const result = await response.json()

      if (result.success) {
        await fetchBookmarksAndCategories()
        resetForm()
        alert(editingBookmark ? '书签更新成功' : '书签创建成功')
      } else {
        alert(result.error?.message || '操作失败')
      }
    } catch (error) {
      console.error('提交失败:', error)
      alert('操作失败，请重试')
    }
  }

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description || '',
      categoryId: bookmark.categoryId,
      tags: bookmark.tags.join(', ')
    })
    setShowAddModal(true)
  }

  const handleDelete = async (bookmarkId: number) => {
    if (!confirm('确定要删除这个书签吗？')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/admin/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        await fetchBookmarksAndCategories()
        alert('书签删除成功')
      } else {
        alert(result.error?.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '', categoryId: 0, tags: '' })
    setEditingBookmark(null)
    setShowAddModal(false)
  }

  const toggleBookmarkSelection = (bookmarkId: number) => {
    setSelectedBookmarks(prev =>
      prev.includes(bookmarkId)
        ? prev.filter(id => id !== bookmarkId)
        : [...prev, bookmarkId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedBookmarks(
      selectedBookmarks.length === bookmarks.length
        ? []
        : bookmarks.map(bookmark => bookmark.id)
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'inactive': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常'
      case 'inactive': return '失效'
      case 'error': return '错误'
      default: return '未知'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light text-gray-800 mb-2">书签管理</h2>
          <p className="text-gray-500">管理所有书签，支持批量操作</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          ➕ 添加书签
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索书签标题或URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">所有分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 书签列表 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {bookmarks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">暂无书签</h3>
            <p className="text-gray-500 mb-6">添加第一个书签开始管理</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              添加书签
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedBookmarks.includes(bookmark.id)}
                    onChange={() => toggleBookmarkSelection(bookmark.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {bookmark.title}
                        </h3>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {bookmark.url}
                        </a>
                        {bookmark.description && (
                          <p className="text-gray-600 mt-2">{bookmark.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>📁 {bookmark.category?.name || '未分类'}</span>
                          <span className={getStatusColor(bookmark.status)}>
                            ● {getStatusText(bookmark.status)}
                          </span>
                          <span>📅 {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                          {bookmark.tags.length > 0 && (
                            <div className="flex gap-1">
                              {bookmark.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(bookmark)}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          ✏️ 编辑
                        </button>
                        <button
                          onClick={() => handleDelete(bookmark.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          🗑️ 删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一页
          </button>
          <span className="px-4 py-2 text-gray-600">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      )}

      {/* 添加/编辑书签模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              {editingBookmark ? '编辑书签' : '添加书签'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="输入书签标题"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="输入书签描述（可选）"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类 *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value={0}>选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="输入标签，用逗号分隔"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingBookmark ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}