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
    sourcemap: false, // Disable sourcemaps in production for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          toast: ['react-hot-toast'],
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'], // Remove specific console methods
      },
      mangle: {
        properties: {
          regex: /^__/,
        }
      },
      format: {
        comments: false, // Remove comments
      }
    },
  },
  server: {
    port: 5176,
    open: true,
    // Optimize for development
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
  // Use absolute paths for deployment
  base: '/',
  // Optimize CSS
  css: {
    postcss: {
      plugins: [
        // Add any PostCSS plugins here if needed
      ]
    }
  }
})