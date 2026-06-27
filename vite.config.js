import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Force a single React instance — react-leaflet/@react-leaflet/core otherwise
  // get a separate copy under Vite's dep optimizer, causing "Invalid hook call".
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'leaflet', 'react-leaflet', '@react-leaflet/core'],
  },
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
