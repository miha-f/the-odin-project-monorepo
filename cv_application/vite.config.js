import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/the-odin-project-monorepo/cv_application/dist/',
  plugins: [react()],
})
