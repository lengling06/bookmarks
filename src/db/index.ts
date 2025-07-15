import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// 数据库连接类型
export interface Database {
    db: ReturnType<typeof drizzle<typeof schema>>
}

// 创建数据库连接
export function createDatabase(d1: any) {
    return drizzle(d1, { schema })
}

// 导出schema
export * from './schema'