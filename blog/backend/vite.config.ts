import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        target: 'node16',
        ssr: true,
        rollupOptions: {
            input: 'src/index.ts',
            output: {
                format: 'es',
            },
        },
    },
});
