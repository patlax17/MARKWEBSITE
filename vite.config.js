import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the inline asset limit so small icons stay inlined
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split chunks: vendor (React/router), admin (huge page), and app
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom') || id.includes('node_modules/scheduler')) {
            return 'vendor'
          }
          if (id.includes('/pages/Admin')) {
            return 'admin'
          }
        },
      },
    },
  },
})
