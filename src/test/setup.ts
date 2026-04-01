/**
 * Vitest 测试环境设置
 * @description 配置测试环境的全局设置和 Mock
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展 expect 匹配器
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// ==========================================
// 全局 Mock
// ==========================================

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Firebase (基础 Mock)
const firebaseMock = {
  initializeApp: vi.fn(),
  auth: vi.fn(() => ({
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return vi.fn();
    }),
    signInWithPopup: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  })),
  firestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: vi.fn(),
        set: vi.fn(),
      })),
    })),
    enablePersistence: vi.fn(),
  })),
};

// @ts-expect-error - Firebase mock
global.firebase = firebaseMock;

// ==========================================
// 测试工具函数
// ==========================================

/**
 * 创建测试用的维度数据
 */
export const createTestDimensions = () => [
  {
    id: 'dim_1',
    name: '身心健康',
    active: true,
    color: 'bg-emerald-400',
    text: 'text-emerald-500',
    border: 'border-emerald-100',
  },
  {
    id: 'dim_2',
    name: '工作事业',
    active: true,
    color: 'bg-blue-400',
    text: 'text-blue-500',
    border: 'border-blue-100',
  },
  {
    id: 'dim_3',
    name: '财务状况',
    active: true,
    color: 'bg-amber-400',
    text: 'text-amber-500',
    border: 'border-amber-100',
  },
];

/**
 * 创建测试用的历史记录
 */
export const createTestHistory = () => [
  {
    dimName: '身心健康',
    dimColor: 'bg-emerald-400',
    text: '完成晨跑 5 公里',
    tags: ['运动', '户外'],
    pts: 1,
    timestamp: Date.now() - 86400000,
    dateStr: '2024/1/12 08:00',
  },
  {
    dimName: '工作事业',
    dimColor: 'bg-blue-400',
    text: '完成项目提案',
    tags: ['工作'],
    pts: 1,
    timestamp: Date.now(),
    dateStr: '2024/1/13 14:30',
  },
];

/**
 * 等待异步操作
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));
