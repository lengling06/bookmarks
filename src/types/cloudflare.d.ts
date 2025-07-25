// Cloudflare Workers 类型定义

declare global {
    interface D1Database {
        prepare(query: string): D1PreparedStatement
        dump(): Promise<ArrayBuffer>
        batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
        exec(query: string): Promise<D1ExecResult>
    }

    interface D1PreparedStatement {
        bind(...values: any[]): D1PreparedStatement
        first<T = unknown>(colName?: string): Promise<T | null>
        run(): Promise<D1Result>
        all<T = unknown>(): Promise<D1Result<T>>
        raw<T = unknown>(): Promise<T[]>
    }

    interface D1Result<T = Record<string, unknown>> {
        results?: T[]
        success: boolean
        error?: string
        meta: {
            duration: number
            size_after: number
            rows_read: number
            rows_written: number
        }
    }

    interface D1ExecResult {
        count: number
        duration: number
    }
}

export { }