import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
          video: ['video.js', 'react-player', 'plyr-react', 'plyr'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          pdf: ['react-pdf']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
