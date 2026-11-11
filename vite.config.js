import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' membuat build bisa dipasang di GitHub Pages tanpa mengubah path.
export default defineConfig({
  base: './',
  plugins: [react()],
});
