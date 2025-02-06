import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Add this section to handle cookies
        onOpen: (proxy, req, socket) => {
          proxy.events.on('response', (proxy, req, res) => {
            if (res.headers['set-cookie']) {
              res.headers['set-cookie'] = res.headers['set-cookie'].map(cookie => {
                // Add the partitioned attribute to cookies
                return cookie + '; Partitioned'
              })
            }
          })
        }
      }
    }
  }
})