/**
 * useDataSync Hook
 * @module hooks/useDataSync
 * @description 数据同步管理 Hook，处理 localStorage 和 Firestore 的数据读写
 */

import { useState, useCallback } from 'react';
import type { UseDataSyncReturn, AppState, SyncStatus, Dimension } from '@/types';
import { CONFIG, INITIAL_DIMENSIONS, log } from '@/config';

// Firebase 类型（运行时从全局获取）
declare const firebase: any;

/**
 * 获取默认应用状态
 * @returns 初始化的应用状态
 */
const getDefaultState = (): AppState => ({
  name: '',
  avatar: null,
  step: 1,
  dimensions: INITIAL_DIMENSIONS,
  scores: new Array(INITIAL_DIMENSIONS.length).fill(0),
  history: [],
  systemTags: [
    { id: 'tag_1', name: '人生中的第一次', appliesTo: [] },
    { id: 'tag_2', name: '里程碑', appliesTo: [] },
  ],
  recentTags: [],
  updatedAt: new Date().toISOString(),
});

/**
 * useDataSync Hook
 *
 * @description 管理应用数据的持久化和云端同步
 *
 * 功能特性：
 * - localStorage 读写（离线优先）
 * - Firestore 云端同步
 * - 数据完整性检查和修复
 * - 同步状态跟踪
 *
 * @returns {UseDataSyncReturn} 同步状态和操作方法
 *
 * @example
 * const {
 *   syncStatus,
 *   loadFromLocalStorage,
 *   saveToLocalStorage,
 *   syncToFirestore
 * } = useDataSync();
 *
 * // 加载本地数据
 * const localData = loadFromLocalStorage();
 *
 * // 保存到本地
 * saveToLocalStorage(appState);
 *
 * // 同步到云端
 * if (currentUser) {
 *   await syncToFirestore(currentUser.uid, appState);
 * }
 */
export const useDataSync = (): UseDataSyncReturn => {
  // ==========================================
  // 状态定义
  // ==========================================

  /** 同步状态 */
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(CONFIG.SYNC_STATUS.IDLE);

  /** 是否为新用户（无本地数据） */
  const [isNewUser, setIsNewUser] = useState(false);

  // ==========================================
  // localStorage 操作
  // ==========================================

  /**
   * 从 localStorage 加载数据
   * @returns 应用状态或 null
   */
  const loadFromLocalStorage = useCallback((): AppState | null => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE.KEY);
      if (saved) {
        const data = JSON.parse(saved);
        log('从 localStorage 加载数据成功');
        setIsNewUser(false);
        return data;
      }
      log('localStorage 无数据，用户为新用户');
      setIsNewUser(true);
      return null;
    } catch (error) {
      console.error('读取本地数据失败:', error);
      return null;
    }
  }, []);

  /**
   * 保存数据到 localStorage
   * @param data - 要保存的应用状态
   */
  const saveToLocalStorage = useCallback((data: AppState): void => {
    try {
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(CONFIG.STORAGE.KEY, JSON.stringify(dataWithTimestamp));
      log('保存到 localStorage 成功');
    } catch (error) {
      console.error('保存本地数据失败:', error);
    }
  }, []);

  // ==========================================
  // Firestore 操作
  // ==========================================

  /**
   * 同步数据到 Firestore
   * @param userId - 用户 ID
   * @param data - 要同步的应用状态
   */
  const syncToFirestore = useCallback(async (userId: string, data: AppState): Promise<void> => {
    if (!userId) {
      log('未登录，跳过云端同步');
      return;
    }

    try {
      setSyncStatus(CONFIG.SYNC_STATUS.SYNCING);

      const db = firebase.firestore();
      await db.collection('users').doc(userId).set(
        {
          ...data,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      setSyncStatus(CONFIG.SYNC_STATUS.SYNCED);
      log('同步到 Firestore 成功');

      // 3 秒后重置状态
      setTimeout(() => {
        setSyncStatus(CONFIG.SYNC_STATUS.IDLE);
      }, 3000);
    } catch (error) {
      console.error('同步到 Firestore 失败:', error);
      setSyncStatus(CONFIG.SYNC_STATUS.OFFLINE);
    }
  }, []);

  /**
   * 从 Firestore 加载数据
   * @param userId - 用户 ID
   * @returns 应用状态或 null
   */
  const loadFromFirestore = useCallback(async (userId: string): Promise<AppState | null> => {
    if (!userId) {
      return null;
    }

    try {
      setSyncStatus(CONFIG.SYNC_STATUS.SYNCING);

      const db = firebase.firestore();
      const doc = await db.collection('users').doc(userId).get();

      if (doc.exists) {
        const data = doc.data() as AppState;
        setSyncStatus(CONFIG.SYNC_STATUS.SYNCED);
        log('从 Firestore 加载数据成功');
        return data;
      }

      setSyncStatus(CONFIG.SYNC_STATUS.IDLE);
      log('Firestore 无数据');
      return null;
    } catch (error) {
      console.error('从 Firestore 加载失败:', error);
      setSyncStatus(CONFIG.SYNC_STATUS.OFFLINE);
      return null;
    }
  }, []);

  // ==========================================
  // 数据完整性检查
  // ==========================================

  /**
   * 确保数据完整性
   *
   * @description 修复缺失的字段，合并新旧数据，保留用户有效数据
   *
   * @param data - 新数据（可能不完整）
   * @param currentState - 当前状态
   * @returns 完整的应用状态
   */
  const ensureDataIntegrity = useCallback(
    (data: Partial<AppState>, currentState: Partial<AppState>): AppState => {
      const defaultState = getDefaultState();

      // 合并策略：优先使用新数据，回退到当前状态，最后使用默认值
      const merged: AppState = {
        // 用户信息：优先保留非空值
        name: data.name || currentState.name || defaultState.name,
        avatar: data.avatar || currentState.avatar || defaultState.avatar,

        // 步骤：取较大值（表示用户已完成更多引导）
        step: Math.max(data.step || 0, currentState.step || 0, defaultState.step),

        // 维度配置：必须有效
        dimensions: ensureDimensions(data.dimensions, currentState.dimensions),

        // 积分：与维度数量对齐
        scores: [],

        // 历史记录：合并去重
        history: mergeHistory(data.history, currentState.history),

        // 标签配置
        systemTags: data.systemTags || currentState.systemTags || defaultState.systemTags,
        recentTags: data.recentTags || currentState.recentTags || defaultState.recentTags,

        // 时间戳
        updatedAt: new Date().toISOString(),
      };

      // 确保 scores 数组长度与 dimensions 匹配
      const dimCount = merged.dimensions.length;
      const dataScores = data.scores || [];
      const currentScores = currentState.scores || [];

      merged.scores = new Array(dimCount).fill(0).map((_, i) => {
        return dataScores[i] ?? currentScores[i] ?? 0;
      });

      log('数据完整性检查完成', {
        hasName: !!merged.name,
        hasAvatar: !!merged.avatar,
        dimCount: merged.dimensions.length,
        historyCount: merged.history.length,
      });

      return merged;
    },
    []
  );

  return {
    syncStatus,
    isNewUser,
    loadFromLocalStorage,
    saveToLocalStorage,
    syncToFirestore,
    loadFromFirestore,
    ensureDataIntegrity,
  };
};

// ==========================================
// 辅助函数
// ==========================================

/**
 * 确保维度配置有效
 */
function ensureDimensions(
  newDims: Dimension[] | undefined,
  currentDims: Dimension[] | undefined
): Dimension[] {
  // 使用有效的维度数组
  let dims = newDims?.length ? newDims : currentDims?.length ? currentDims : INITIAL_DIMENSIONS;

  // 确保每个维度都有必需的字段
  return dims.map((dim, i) => ({
    id: dim.id || `dim_${i + 1}`,
    name: dim.name || `维度 ${i + 1}`,
    active: dim.active ?? true,
    color: dim.color || 'bg-slate-400',
    text: dim.text || 'text-slate-500',
    border: dim.border || 'border-slate-100',
  }));
}

/**
 * 合并历史记录（去重）
 */
function mergeHistory(
  newHistory: AppState['history'] | undefined,
  currentHistory: AppState['history'] | undefined
): AppState['history'] {
  const history = newHistory?.length ? newHistory : currentHistory || [];

  // 按时间戳去重
  const seen = new Set<number>();
  return history.filter((record) => {
    if (seen.has(record.timestamp)) {
      return false;
    }
    seen.add(record.timestamp);
    return true;
  });
}

export default useDataSync;
