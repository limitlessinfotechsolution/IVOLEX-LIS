// vite.config.js
import { defineConfig } from "file:///C:/Users/FAISAL/Downloads/IVOLEX/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/FAISAL/Downloads/IVOLEX/node_modules/@vitejs/plugin-react/dist/index.js";
import { visualizer } from "file:///C:/Users/FAISAL/Downloads/IVOLEX/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///C:/Users/FAISAL/Downloads/IVOLEX/node_modules/vite-plugin-compression/dist/index.mjs";
import path from "path";
import { fileURLToPath } from 'url'; // Add this import for ES module compatibility

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz"
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br"
    }),
    visualizer({
      filename: "dist/bundle-analysis.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["framer-motion", "lucide-react"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          toast: ["react-hot-toast"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 5176,
    open: true
  }
});
export {
  vite_config_default as default
};