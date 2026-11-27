import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  // GitHub Pages project site: https://olgaoriami-gif.github.io/Portfolio-oriamio/
  // When a custom domain is connected, change base to '/'.
  base: '/Portfolio-oriamio/',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.mp4'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
