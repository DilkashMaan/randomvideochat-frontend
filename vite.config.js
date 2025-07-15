import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
  server: {
    allowedHosts: [
      'b9a4-203-134-205-165.ngrok-free.app'
    ]
  },
})
