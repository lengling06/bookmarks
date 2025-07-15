// 简单的API测试工具
// 在开发环境中可以用来测试API端点

export const testEndpoints = [
    {
        name: 'Health Check',
        method: 'GET',
        url: '/health',
        description: '检查API服务状态'
    },
    {
        name: 'Get Categories',
        method: 'GET',
        url: '/api/categories',
        description: '获取所有分类'
    },
    {
        name: 'Search Bookmarks',
        method: 'GET',
        url: '/api/search?q=github',
        description: '搜索书签'
    },
    {
        name: 'Admin Login',
        method: 'POST',
        url: '/api/admin/login',
        body: {
            username: 'admin',
            password: 'admin'
        },
        description: '管理员登录'
    },
    {
        name: 'Admin Stats',
        method: 'GET',
        url: '/api/admin/stats',
        description: '获取统计信息（需要认证）'
    }
]

// 测试函数（在浏览器控制台中使用）
export function generateTestScript() {
    return `
// 在浏览器控制台中运行以下代码来测试API

const API_BASE = window.location.origin;

// 测试健康检查
fetch(API_BASE + '/health')
  .then(r => r.json())
  .then(console.log);

// 测试获取分类
fetch(API_BASE + '/api/categories')
  .then(r => r.json())
  .then(console.log);

// 测试搜索
fetch(API_BASE + '/api/search?q=github')
  .then(r => r.json())
  .then(console.log);

// 测试管理员登录
fetch(API_BASE + '/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' })
})
  .then(r => r.json())
  .then(console.log);
`
}