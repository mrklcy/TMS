import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    sourcemap: false, // Completely disables source maps so original source code is hidden in browser DevTools Sources
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    esbuild: {
      drop: ['console', 'debugger'] // Removes console.log, console.warn, and debugger statements from bundle
    }
  }
});
