# 书签管理系统部署指南

## 部署架构

本项目采用 Cloudflare 全栈部署方案：
- **前端**: Cloudflare Pages
- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)

## 部署步骤

### 1. 准备工作

```bash
# 安装依赖
npm install

# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

### 2. 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create bookmark-db

# 记录返回的 database_id，更新 wrangler.toml 中的 database_id
```

### 3. 运行数据库迁移

```bash
# 本地迁移（开发环境）
wrangler d1 migrations apply bookmark-db --local

# 生产环境迁移
wrangler d1 migrations apply bookmark-db
```

### 4. 设置环境变量

```bash
# 设置 JWT 密钥
wrangler secret put JWT_SECRET

# 设置管理员密码哈希（可选，也可以使用数据库中的默认账户）
wrangler secret put ADMIN_PASSWORD_HASH
```

### 5. 部署 Workers（后端 API）

```bash
# 部署到 Cloudflare Workers
wrangler deploy
```

### 6. 部署前端到 Cloudflare Pages

#### 方法一：通过 Cloudflare Dashboard

1. 登录 Cloudflare Dashboard
2. 进入 Pages 页面
3. 连接 Git 仓库
4. 设置构建配置：
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
   - Node.js 版本: `18`

#### 方法二：通过 Wrangler CLI

```bash
# 构建前端
npm run build

# 部署到 Pages
wrangler pages deploy dist --project-name bookmark-manager
```

### 7. 配置环境变量

在 Cloudflare Pages 设置中添加环境变量：
- `VITE_API_BASE`: Workers 的 URL（如：https://bookmark-manager.your-subdomain.workers.dev/api）

## 本地开发

### 启动开发环境

```bash
# 启动前端开发服务器
npm run dev

# 启动 Workers 开发服务器
npm run worker:dev

# 同时启动前端和后端
npm run dev:full
```

### 本地数据库

```bash
# 查看本地数据库
wrangler d1 execute bookmark-db --local --command "SELECT * FROM categories"

# 打开数据库管理界面
npm run db:studio
```

## 管理员账户

默认管理员账户：
- 用户名: `admin`
- 密码: `admin123`

**重要**: 部署到生产环境后，请立即修改默认密码！

## 域名配置

### 自定义域名

1. 在 Cloudflare Pages 设置中添加自定义域名
2. 更新 DNS 记录指向 Cloudflare Pages
3. 启用 HTTPS（自动）

### API 域名

Workers 会自动获得一个 `*.workers.dev` 域名，也可以配置自定义域名。

## 监控和日志

### 查看 Workers 日志

```bash
# 实时查看日志
wrangler tail

# 查看特定时间段的日志
wrangler tail --since 1h
```

### 性能监控

- Cloudflare Analytics 自动提供访问统计
- Workers Analytics 提供 API 调用统计
- 可以集成第三方监控服务

## 备份和恢复

### 数据库备份

```bash
# 导出数据库
wrangler d1 export bookmark-db --output backup.sql

# 从备份恢复
wrangler d1 execute bookmark-db --file backup.sql
```

### 书签数据导出

通过管理后台的导出功能，可以导出书签数据为多种格式。

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 wrangler.toml 中的 database_id 是否正确
   - 确认数据库迁移已执行

2. **API 调用失败**
   - 检查 CORS 配置
   - 确认 Workers 部署成功
   - 查看 Workers 日志

3. **认证问题**
   - 检查 JWT_SECRET 是否设置
   - 确认管理员账户存在

### 调试命令

```bash
# 检查 Workers 状态
wrangler status

# 查看 D1 数据库列表
wrangler d1 list

# 测试 API 端点
curl https://your-worker.workers.dev/health
```

## 安全建议

1. **更改默认密码**: 部署后立即修改管理员密码
2. **使用强密钥**: 设置复杂的 JWT_SECRET
3. **定期备份**: 定期导出书签数据
4. **监控访问**: 关注异常访问模式
5. **更新依赖**: 定期更新项目依赖

## 成本估算

Cloudflare 免费层额度：
- **Pages**: 无限带宽，500次构建/月
- **Workers**: 100,000次请求/天
- **D1**: 100,000次读取/天，50,000次写入/天，5GB存储

对于个人书签管理，免费层完全够用。