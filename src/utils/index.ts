/**
 * Life-Matrix 工具函数
 * @module utils
 */

import { CONFIG } from '@/config';

// ==========================================
// 等级计算算法
// ==========================================

/**
 * 计算用户等级（二次递增模型）
 *
 * @description 使用二次函数实现等级递增，确保前期升级快、后期需要更多努力
 *
 * 数学公式：Level = floor(-2 + sqrt(4 + score))
 *
 * 等级对照表：
 * - Level 0: 0-4 分
 * - Level 1: 5-10 分
 * - Level 2: 11-18 分
 * - Level 3: 19-28 分
 * - Level N: 需要累计 N² + 4N 分
 *
 * @param score - 当前累计积分
 * @returns 等级数值（0 或正整数）
 *
 * @example
 * calculateLevel(0)   // => 0
 * calculateLevel(5)   // => 1
 * calculateLevel(11)  // => 2
 * calculateLevel(100) // => 8
 */
export const calculateLevel = (score: number): number => {
  if (!score || score < 5) return 0;
  return Math.floor(-2 + Math.sqrt(4 + score));
};

/**
 * 计算当前等级的升级进度百分比
 *
 * @description 计算从当前等级到下一等级的进度
 *
 * @param score - 当前累计积分
 * @returns 进度百分比 (0-100)
 *
 * @example
 * getProgress(5)  // => 0 (刚到 Level 1)
 * getProgress(7)  // => 33.33 (Level 1 进度 1/3)
 * getProgress(10) // => 83.33 (Level 1 即将升级)
 */
export const getProgress = (score: number): number => {
  const level = calculateLevel(score);
  const sStart = level * level + 4 * level; // 当前等级起始分数
  const nextL = level + 1;
  const sEnd = nextL * nextL + 4 * nextL; // 下一等级起始分数
  const needed = sEnd - sStart; // 升级所需分数
  return needed > 0 ? ((score - sStart) / needed) * 100 : 0;
};

/**
 * 计算各维度发展的平衡度
 *
 * @description 使用变异系数 (CV) 评估各维度发展的均衡程度
 *
 * 数学公式：Balance = max(0, 100 - CV × 100)
 * 其中 CV = 标准差 / 平均值
 *
 * - 100%: 所有维度积分相等，完美平衡
 * - 0%: 维度差异极大，严重失衡
 *
 * @param scores - 各维度积分数组
 * @returns 平衡度百分比 (0-100)
 *
 * @example
 * calculateBalance([10, 10, 10, 10]) // => 100 (完美平衡)
 * calculateBalance([20, 0, 0, 0])    // => 0 (极度失衡)
 * calculateBalance([8, 10, 12, 10])  // => ~87 (轻微失衡)
 */
export const calculateBalance = (scores: number[]): number => {
  if (!scores || scores.length === 0) return 100;
  const sum = scores.reduce((a, b) => a + b, 0);
  if (sum === 0) return 100;
  const mean = sum / scores.length;
  const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
  return Math.round(Math.max(0, 100 - (Math.sqrt(variance) / mean) * 100));
};

// ==========================================
// 标签处理函数
// ==========================================

/**
 * 从文本中解析所有格式的标签
 *
 * @description 支持三种标签格式：【标签】、[标签]、#标签
 * @param text - 要解析的文本
 * @returns 提取的标签数组（已去重）
 *
 * @example
 * parseTagsFromText("今天【运动】了 #健身")  // => ["运动", "健身"]
 * parseTagsFromText("完成[工作]任务")        // => ["工作"]
 */
export const parseTagsFromText = (text: string): string[] => {
  if (!text) return [];
  const matches: string[] = [];

  // 1. 解析【】格式（中文方括号）
  const regex1 = /【([^】]+)】/g;
  let match: RegExpExecArray | null;
  while ((match = regex1.exec(text)) !== null) {
    const tag = match[1].trim();
    if (tag && !matches.includes(tag)) {
      matches.push(tag);
    }
  }

  // 2. 解析[]格式（英文方括号）
  const regex2 = /\[([^\]]+)\]/g;
  while ((match = regex2.exec(text)) !== null) {
    const tag = match[1].trim();
    if (tag && !matches.includes(tag)) {
      matches.push(tag);
    }
  }

  // 3. 解析#标签格式（话题标签）
  const regex3 = /#([^\s#\[\]【】,\.。，！？!?]+)/g;
  while ((match = regex3.exec(text)) !== null) {
    const tag = match[1].trim();
    if (tag && !matches.includes(tag)) {
      matches.push(tag);
    }
  }

  return matches;
};

/**
 * 统一标签格式为中文方括号
 *
 * @description 将 #标签 和 [标签] 转换为【标签】格式
 * @param text - 原始文本
 * @returns 格式化后的文本
 */
export const normalizeTagsInText = (text: string): string => {
  if (!text) return text;
  let normalized = text;
  normalized = normalized.replace(/\[([^\]]+)\]/g, '【$1】');
  normalized = normalized.replace(/#([^\s#\[\]【】,\.。，！？!?]+)/g, '【$1】');
  return normalized;
};

/**
 * 自动识别文本中的已知标签词并添加标记
 *
 * @description 在文本中查找已知标签，自动添加【】包裹
 * @param text - 原始文本
 * @param availableTags - 可用标签列表
 * @returns 处理后的文本
 */
export const autoWrapTagsInText = (text: string, availableTags: string[]): string => {
  if (!text || !availableTags || availableTags.length === 0) return text;
  let result = text;
  // 按长度降序排序，优先匹配长标签
  const sortedTags = [...availableTags].sort((a, b) => b.length - a.length);

  sortedTags.forEach((tag) => {
    if (!tag || tag.trim().length === 0) return;
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!【)${escapedTag}(?!】)`, 'g');
    result = result.replace(regex, (match, offset) => {
      const before = result.substring(0, offset);
      const openCount = (before.match(/【/g) || []).length;
      const closeCount = (before.match(/】/g) || []).length;
      // 避免嵌套标记
      if (openCount > closeCount) return match;
      return `【${match}】`;
    });
  });
  return result;
};

/**
 * 更新最近使用的标签列表
 *
 * @description 将新使用的标签移到列表开头，保持最多 N 个
 * @param currentRecentTags - 当前最近标签列表
 * @param newTags - 新使用的标签
 * @returns 更新后的最近标签列表
 */
export const updateRecentTags = (currentRecentTags: string[], newTags: string[]): string[] => {
  if (!newTags || newTags.length === 0) return currentRecentTags;
  const updated = [...currentRecentTags];
  newTags.forEach((tag) => {
    const index = updated.indexOf(tag);
    if (index > -1) updated.splice(index, 1);
    updated.unshift(tag);
  });
  return updated.slice(0, CONFIG.LIMITS.MAX_RECENT_TAGS);
};

// ==========================================
// 日期格式化函数
// ==========================================

/**
 * 格式化日期为本地化字符串
 * @param date - 日期对象或时间戳
 * @returns 格式化的日期字符串
 */
export const formatDate = (date: Date | number): string => {
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 格式化日期为 ISO 日期字符串 (YYYY-MM-DD)
 * @param date - 日期对象
 * @returns ISO 日期字符串
 */
export const formatISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// ==========================================
// 数据验证函数
// ==========================================

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证密码强度
 * @param password - 密码
 * @returns 是否满足最低要求
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= CONFIG.LIMITS.MIN_PASSWORD_LENGTH;
};
