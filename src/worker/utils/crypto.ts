// 加密工具函数

// 简化的密码哈希函数（生产环境建议使用bcrypt）
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'bookmark-salt')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 验证密码
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await hashPassword(password)
    return passwordHash === hash
}

// 生成随机字符串
export function generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

// JWT工具类（改进版）
export class JWT {
    private static encoder = new TextEncoder()
    private static decoder = new TextDecoder()

    // Base64URL编码
    private static base64UrlEncode(data: Uint8Array): string {
        const base64 = btoa(String.fromCharCode(...data))
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }

    // Base64URL解码
    private static base64UrlDecode(str: string): Uint8Array {
        str = str.replace(/-/g, '+').replace(/_/g, '/')
        while (str.length % 4) {
            str += '='
        }
        const binary = atob(str)
        return new Uint8Array(binary.split('').map(c => c.charCodeAt(0)))
    }

    // 生成JWT
    static async sign(payload: any, secret: string, expiresIn: number = 24 * 60 * 60): Promise<string> {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        }

        const now = Math.floor(Date.now() / 1000)
        const tokenPayload = {
            ...payload,
            iat: now,
            exp: now + expiresIn
        }

        const headerEncoded = this.base64UrlEncode(this.encoder.encode(JSON.stringify(header)))
        const payloadEncoded = this.base64UrlEncode(this.encoder.encode(JSON.stringify(tokenPayload)))

        const message = `${headerEncoded}.${payloadEncoded}`
        const key = await crypto.subtle.importKey(
            'raw',
            this.encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign('HMAC', key, this.encoder.encode(message))
        const signatureEncoded = this.base64UrlEncode(new Uint8Array(signature))

        return `${message}.${signatureEncoded}`
    }

    // 验证JWT
    static async verify(token: string, secret: string): Promise<any> {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Invalid token format')
        }

        const [headerEncoded, payloadEncoded, signatureEncoded] = parts

        // 验证签名
        const message = `${headerEncoded}.${payloadEncoded}`
        const key = await crypto.subtle.importKey(
            'raw',
            this.encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        )

        const signature = this.base64UrlDecode(signatureEncoded)
        const isValid = await crypto.subtle.verify('HMAC', key, signature, this.encoder.encode(message))

        if (!isValid) {
            throw new Error('Invalid signature')
        }

        // 解析payload
        const payloadData = this.base64UrlDecode(payloadEncoded)
        const payload = JSON.parse(this.decoder.decode(payloadData))

        // 检查过期时间
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp && payload.exp < now) {
            throw new Error('Token expired')
        }

        return payload
    }
}