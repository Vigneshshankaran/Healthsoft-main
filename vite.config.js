import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://project-ze144.vercel.app',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Strip Origin header to bypass backend CORS filter restrictions (especially for PATCH method)
            proxyReq.removeHeader('origin');
            const auth = req.headers['authorization'];
            if (auth) {
              console.log('[PROXY] Auth Header:', auth);
            }
          });
        }
      }
    }
  },
})
