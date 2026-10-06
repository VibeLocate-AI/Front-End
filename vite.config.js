import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'https://vibelocate-laravel.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/ai-service': {
        target: 'https://ai1-j8rp.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ai-service/, '')
      }
    }
  }
})
