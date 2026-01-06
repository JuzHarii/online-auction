import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    root: 'client',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': `http://localhost:${process.env.PORT}`,
      },
    },
    build: {
      outDir: '../server/src/views/dist',
    },
  };
});
