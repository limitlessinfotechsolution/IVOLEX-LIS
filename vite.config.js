import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url' // Add this import for ES module compatibility

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Use the proper __dirname
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          toast: ['react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5176,
    open: true,
  },
  // Use absolute paths for deployment
  base: '/',
})