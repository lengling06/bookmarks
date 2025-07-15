# 书签管理系统

一个基于 React + Cloudflare 的现代化书签管理系统，支持公开展示和管理员后台。

## 功能特性

- 📚 **公开展示页面** - 访问者可以浏览分类书签
- 🔍 **实时搜索** - 快速查找特定书签
- 👨‍💼 **管理员后台** - 完整的书签和分类管理
- 📥 **导入导出** - 支持多种格式的书签导入导出
- 🔗 **链接检查** - 自动验证书签链接有效性
- 📊 **统计分析** - 书签使用情况统计

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS
- **构建工具**: Vite
- **路由**: React Router
- **状态管理**: TanStack Query
- **部署**: Cloudflare Pages + Workers + D1

## 开发环境设置

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建项目
```bash
npm run build
```

## 项目结构

```
src/
├── pages/              # 页面组件
│   ├── HomePage.tsx        # 首页
│   ├── CategoryPage.tsx    # 分类页面
│   ├── SearchPage.tsx      # 搜索页面
│   └── admin/              # 管理员页面
├── components/         # 通用组件
│   ├── BookmarkCard.tsx    # 书签卡片
│   ├── CategoryCard.tsx    # 分类卡片
│   ├── SearchBox.tsx       # 搜索框
│   └── EmptyState.tsx      # 空状态组件
├── hooks/             # 自定义 Hooks
│   └── useApi.ts          # API 调用 hooks
├── worker/            # Cloudflare Workers 后端
│   ├── index.ts           # Workers 入口
│   ├── routes/            # API 路由
│   ├── middleware/        # 中间件
│   └── utils/             # 工具函数
├── db/                # 数据库相关
│   └── schema.ts          # 数据库模式
├── utils/             # 工具函数
└── types/             # TypeScript 类型定义
```

## 快速开始

1. 克隆项目
```bash
git clone <repository-url>
cd bookmark-manager
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件
```

4. 启动开发服务器
```bash
# 启动前端
npm run dev

# 启动后端 (另一个终端)
npm run worker:dev

# 或同时启动
npm run dev:full
```

## 部署

项目设计为部署在 Cloudflare 平台：
- **前端**：Cloudflare Pages
- **后端**：Cloudflare Workers  
- **数据库**：Cloudflare D1

详细部署说明请参考 [deploy.md](./deploy.md)。

## API 文档

### 公开 API
- `GET /api/categories` - 获取所有分类
- `GET /api/categories/:id/bookmarks` - 获取分类下的书签
- `GET /api/search` - 搜索书签

### 管理员 API
- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/stats` - 获取统计信息
- `GET /api/admin/categories` - 管理分类
- `GET /api/admin/bookmarks` - 管理书签
- `POST /api/admin/import/bookmarks` - 导入书签
- `POST /api/admin/export/bookmarks` - 导出书签
- `POST /api/admin/links/check-batch` - 批量检查链接