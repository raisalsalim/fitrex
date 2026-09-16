import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path makes it work anywhere on GitHub Pages!
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
