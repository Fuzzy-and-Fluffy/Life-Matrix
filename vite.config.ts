import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
  },

  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true, // 允许局域网访问
  },

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 分割代码块
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  },

  // PWA 相关
  publicDir: 'public',
});
