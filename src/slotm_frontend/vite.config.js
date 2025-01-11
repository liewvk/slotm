import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['*.did.js'],
    },
  },
  define: {
    global: 'globalThis', // Fixes "global is not defined" error
    'process.env': {}, // Ensures environment variables work correctly
  },
  resolve: {
    alias: {
      '@declarations': path.resolve(__dirname, 'src/declarations'),
      buffer: 'buffer/', // Fixes "Could not resolve buffer/"
    },
  },
  optimizeDeps: {
    include: ['buffer', 'protobufjs'], // Ensures protobufjs is bundled properly
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    cors: true,
  },
});
