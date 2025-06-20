import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}) 
=======
  plugins: [react(),tailwindcss(),],
})
>>>>>>> dfc13b7b59b82e6cae8d7d607ee736361cfb843b
