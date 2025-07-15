import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            onwarn(warning, warn) {
                // 忽略某些警告
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
                warn(warning)
            }
        }
    },
    esbuild: {
        // 忽略未使用的导入
        legalComments: 'none'
    }
})