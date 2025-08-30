import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dotenv from 'dotenv'

export default defineConfig(async ({ mode }) => {
    let proxy = undefined
    if (mode === 'development') {
        proxy = {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            }
        }
    }

    dotenv.config()
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '@codemirror/state': resolve(__dirname, '../../node_modules/@codemirror/state'),
                '@codemirror/view': resolve(__dirname, '../../node_modules/@codemirror/view'),
                '@codemirror/language': resolve(__dirname, '../../node_modules/@codemirror/language'),
                '@codemirror/lang-javascript': resolve(__dirname, '../../node_modules/@codemirror/lang-javascript'),
                '@codemirror/lang-json': resolve(__dirname, '../../node_modules/@codemirror/lang-json'),
                '@uiw/react-codemirror': resolve(__dirname, '../../node_modules/@uiw/react-codemirror'),
                '@uiw/codemirror-theme-vscode': resolve(__dirname, '../../node_modules/@uiw/codemirror-theme-vscode'),
                '@uiw/codemirror-theme-sublime': resolve(__dirname, '../../node_modules/@uiw/codemirror-theme-sublime'),
                '@lezer/common': resolve(__dirname, '../../node_modules/@lezer/common'),
                '@lezer/highlight': resolve(__dirname, '../../node_modules/@lezer/highlight')
            }
        },
        root: resolve(__dirname),
        build: {
            outDir: './dist'
        },
        server: {
            open: true,
            proxy,
            port: process.env.VITE_PORT ?? 8080,
            host: process.env.VITE_HOST
        }
    }
})
