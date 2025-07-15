import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// 分类表
export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    description: text('description'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 书签表
export const bookmarks = sqliteTable('bookmarks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    url: text('url').notNull(),
    description: text('description'),
    categoryId: integer('category_id').notNull().references(() => categories.id),
    tags: text('tags'), // JSON字符串存储标签数组
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    lastChecked: text('last_checked'),
    status: text('status', { enum: ['active', 'inactive', 'error'] }).notNull().default('active'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 管理员表
export const admins = sqliteTable('admins', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

// 导出表类型
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert

export type Admin = typeof admins.$inferSelect
export type NewAdmin = typeof admins.$inferInsert