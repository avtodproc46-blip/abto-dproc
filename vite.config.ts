import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local + GitHub user Pages: `/`
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base,
})
