/**
 * Life-Matrix 全局配置
 * @module config
 */

import type { Dimension, SystemTag } from '@/types';

/**
 * 全局配置常量
 * @description 集中管理所有可配置项，便于维护和调整
 */
export const CONFIG = {
  // 调试模式：发布前设为 false
  DEBUG: import.meta.env.DEV,

  // 版本信息
  VERSION: '3.6.0',

  // 存储配置
  STORAGE: {
    KEY: 'life_matrix_v34_csv',
    GEMINI_API_KEY: 'gemini_api_key',
  },

  // 数据限制
  LIMITS: {
    MAX_HISTORY_DISPLAY: 5,
    MAX_HISTORY_STORAGE: 100,
    MAX_DIMENSIONS: 12,
    MIN_DIMENSIONS: 3,
    MAX_RECENT_TAGS: 10,
    MIN_PASSWORD_LENGTH: 6,
  },

  // 雷达图配置
  RADAR: {
    RADIUS: 125,
    LABEL_DISTANCE: 155,
    DEFAULT_SIZE: 400,
    MAX_SIZE: 480,
    PADDING: 50,
  },

  // 同步状态枚举
  SYNC_STATUS: {
    IDLE: 'idle' as const,
    SYNCING: 'syncing' as const,
    SYNCED: 'synced' as const,
    OFFLINE: 'offline' as const,
  },
} as const;

/**
 * Firebase 配置
 */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBH1q0cAYUfKg04brS2JN4Rmm4FSqne2JU',
  authDomain: 'life-matrix-c6b45.firebaseapp.com',
  projectId: 'life-matrix-c6b45',
  storageBucket: 'life-matrix-c6b45.firebasestorage.app',
  messagingSenderId: '586491009176',
  appId: '1:586491009176:web:3c60fce03bc5e8033098ed',
  measurementId: 'G-XTY0XDG3DF',
};

/**
 * 默认维度配置
 * @description 新用户的初始维度设置，包含 8 个人生领域
 */
export const INITIAL_DIMENSIONS: Dimension[] = [
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
  {
    id: 'dim_4',
    name: '家庭关系',
    active: true,
    color: 'bg-rose-400',
    text: 'text-rose-500',
    border: 'border-rose-100',
  },
  {
    id: 'dim_5',
    name: '社交连接',
    active: true,
    color: 'bg-purple-400',
    text: 'text-purple-500',
    border: 'border-purple-100',
  },
  {
    id: 'dim_6',
    name: '个人成长',
    active: true,
    color: 'bg-indigo-400',
    text: 'text-indigo-500',
    border: 'border-indigo-100',
  },
  {
    id: 'dim_7',
    name: '精神生活',
    active: false,
    color: 'bg-cyan-400',
    text: 'text-cyan-500',
    border: 'border-cyan-100',
  },
  {
    id: 'dim_8',
    name: '休闲玩乐',
    active: false,
    color: 'bg-orange-400',
    text: 'text-orange-500',
    border: 'border-orange-100',
  },
];

/**
 * 默认系统标签
 */
export const INITIAL_SYSTEM_TAGS: SystemTag[] = [
  { id: 'tag_1', name: '人生中的第一次', appliesTo: [] },
  { id: 'tag_2', name: '里程碑', appliesTo: [] },
];

/**
 * 调试日志函数
 * @description 仅在 DEBUG 模式下输出日志，生产环境静默
 */
export const log = CONFIG.DEBUG
  ? console.log.bind(console, '[LM]')
  : () => {};

/**
 * 性能日志函数
 * @param label - 日志标签
 * @param action - 动作类型：'start' | 'end' | 'log'
 */
export const perfLog = (label: string, action: 'start' | 'end' | 'log' = 'log'): void => {
  if (action === 'start') {
    console.time(`[Perf] ${label}`);
  } else if (action === 'end') {
    console.timeEnd(`[Perf] ${label}`);
  } else {
    console.log(`[Perf] ${label}`);
  }
};
