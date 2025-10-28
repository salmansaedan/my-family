import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.tsx',
      name: 'SaedanFamilyApp',
      formats: ['es'],
      fileName: () => '_worker.js'
    },
    rollupOptions: {
      external: ['cloudflare:workers']
    }
  }
})