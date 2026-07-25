import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local: `/`
// GitHub Pages CI sets VITE_BASE_PATH=/abto-dproc/
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base,
})
