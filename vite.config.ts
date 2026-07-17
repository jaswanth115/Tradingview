import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://jaswanth115.github.io/Tradingview/
export default defineConfig({
  plugins: [react()],
  base: '/Tradingview/',
});
