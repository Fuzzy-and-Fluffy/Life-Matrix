/**
 * Vitest 测试配置
 * @description 配置测试环境、覆盖率和路径别名
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // 测试环境
    environment: 'jsdom',

    // 全局设置
    globals: true,

    // 设置文件
    setupFiles: ['./src/test/setup.ts'],

    // 包含的测试文件模式
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },

    // 依赖优化
    deps: {
      inline: ['react', 'react-dom'],
    },
  },

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
});
