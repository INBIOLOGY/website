import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        courses: resolve(__dirname, 'courses.html'),
        classroom: resolve(__dirname, 'classroom.html'),
        exam: resolve(__dirname, 'exam.html'),
        admin: resolve(__dirname, 'admin.html'),
        login: resolve(__dirname, 'login.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        guide: resolve(__dirname, 'guide.html'),
        fallback404: resolve(__dirname, '404.html'),
      },
    },
  },
})