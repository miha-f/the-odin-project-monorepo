import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoBase = '/the-odin-project-monorepo/shopping_cart/dist/';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
    return {
        base: command === 'build' ? `/${repoBase}/` : '/',
        plugins: [
            tailwindcss(),
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    };
})
