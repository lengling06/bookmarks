import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                {/* 公开页面 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />

                {/* 管理员页面 */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
        </div>
    )
}

export default App