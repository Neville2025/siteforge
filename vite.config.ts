import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use relative paths so the same build works on GitHub Pages (/siteforge/)
  // AND on Vercel's root domain. The /api/* routes are absolute, which is fine
  // for Vercel; on GH Pages they 404 (use Vercel for AI features).
  base: './',
})
