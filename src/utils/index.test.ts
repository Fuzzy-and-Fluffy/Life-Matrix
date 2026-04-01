/**
 * 工具函数单元测试
 * @module utils/index.test
 */

import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  getProgress,
  calculateBalance,
  parseTagsFromText,
  normalizeTagsInText,
  autoWrapTagsInText,
  updateRecentTags,
  formatDate,
  formatISODate,
  isValidEmail,
  isValidPassword,
} from './index';

// ==========================================
// 等级计算测试
// ==========================================

describe('calculateLevel', () => {
  it('should return 0 for scores less than 5', () => {
    expect(calculateLevel(0)).toBe(0);
    expect(calculateLevel(1)).toBe(0);
    expect(calculateLevel(4)).toBe(0);
  });

  it('should return correct level for known score values', () => {
    expect(calculateLevel(5)).toBe(1);
    expect(calculateLevel(10)).toBe(1);
    expect(calculateLevel(11)).toBe(2);
    expect(calculateLevel(18)).toBe(2);
    expect(calculateLevel(19)).toBe(3);
    expect(calculateLevel(100)).toBe(8);
  });

  it('should handle undefined and null', () => {
    expect(calculateLevel(undefined as unknown as number)).toBe(0);
    expect(calculateLevel(null as unknown as number)).toBe(0);
  });

  it('should handle negative scores', () => {
    expect(calculateLevel(-10)).toBe(0);
  });
});

describe('getProgress', () => {
  it('should return 0 for level 0 scores', () => {
    expect(getProgress(0)).toBe(0);
    expect(getProgress(2)).toBeGreaterThan(0);
  });

  it('should return 0 at level boundaries', () => {
    // 刚到 Level 1 的起点
    expect(getProgress(5)).toBe(0);
  });

  it('should return progress within 0-100', () => {
    const progress = getProgress(7);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });
});

describe('calculateBalance', () => {
  it('should return 100 for perfectly balanced scores', () => {
    expect(calculateBalance([10, 10, 10, 10])).toBe(100);
    expect(calculateBalance([5, 5, 5])).toBe(100);
  });

  it('should return 0 for extremely unbalanced scores', () => {
    expect(calculateBalance([100, 0, 0, 0])).toBe(0);
  });

  it('should return 100 for empty or all-zero scores', () => {
    expect(calculateBalance([])).toBe(100);
    expect(calculateBalance([0, 0, 0])).toBe(100);
  });

  it('should handle slight imbalances', () => {
    const balance = calculateBalance([8, 10, 12, 10]);
    expect(balance).toBeGreaterThan(80);
    expect(balance).toBeLessThan(100);
  });
});

// ==========================================
// 标签处理测试
// ==========================================

describe('parseTagsFromText', () => {
  it('should parse 【】 format tags', () => {
    expect(parseTagsFromText('今天【运动】了')).toEqual(['运动']);
    expect(parseTagsFromText('【标签1】和【标签2】')).toEqual(['标签1', '标签2']);
  });

  it('should parse [] format tags', () => {
    expect(parseTagsFromText('完成[工作]任务')).toEqual(['工作']);
  });

  it('should parse # format tags', () => {
    expect(parseTagsFromText('今天 #健身 很开心')).toEqual(['健身']);
  });

  it('should handle mixed formats', () => {
    const tags = parseTagsFromText('【运动】#健身 [工作]');
    expect(tags).toContain('运动');
    expect(tags).toContain('健身');
    expect(tags).toContain('工作');
  });

  it('should remove duplicates', () => {
    const tags = parseTagsFromText('【运动】和【运动】');
    expect(tags).toEqual(['运动']);
  });

  it('should handle empty input', () => {
    expect(parseTagsFromText('')).toEqual([]);
    expect(parseTagsFromText(null as unknown as string)).toEqual([]);
  });
});

describe('normalizeTagsInText', () => {
  it('should convert [] to 【】', () => {
    expect(normalizeTagsInText('[标签]')).toBe('【标签】');
  });

  it('should convert # to 【】', () => {
    expect(normalizeTagsInText('#标签')).toBe('【标签】');
  });

  it('should handle empty input', () => {
    expect(normalizeTagsInText('')).toBe('');
    expect(normalizeTagsInText(null as unknown as string)).toBe(null);
  });
});

describe('autoWrapTagsInText', () => {
  it('should wrap known tags', () => {
    const result = autoWrapTagsInText('今天运动了', ['运动']);
    expect(result).toBe('今天【运动】了');
  });

  it('should not double wrap already wrapped tags', () => {
    const result = autoWrapTagsInText('今天【运动】了', ['运动']);
    expect(result).toBe('今天【运动】了');
  });

  it('should handle empty available tags', () => {
    expect(autoWrapTagsInText('测试文本', [])).toBe('测试文本');
  });

  it('should handle empty text', () => {
    expect(autoWrapTagsInText('', ['标签'])).toBe('');
  });
});

describe('updateRecentTags', () => {
  it('should add new tags to the beginning', () => {
    const result = updateRecentTags(['旧标签'], ['新标签']);
    expect(result[0]).toBe('新标签');
  });

  it('should move existing tags to the beginning', () => {
    const result = updateRecentTags(['标签1', '标签2', '标签3'], ['标签3']);
    expect(result[0]).toBe('标签3');
    expect(result.length).toBe(3);
  });

  it('should handle empty new tags', () => {
    const current = ['标签1', '标签2'];
    const result = updateRecentTags(current, []);
    expect(result).toEqual(current);
  });

  it('should limit to MAX_RECENT_TAGS', () => {
    const manyTags = Array.from({ length: 15 }, (_, i) => `标签${i}`);
    const result = updateRecentTags([], manyTags);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

// ==========================================
// 日期格式化测试
// ==========================================

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date('2024-01-13T10:30:00');
    const result = formatDate(date);
    expect(result).toContain('1月');
    expect(result).toContain('13');
  });

  it('should format timestamp', () => {
    const timestamp = new Date('2024-01-13T10:30:00').getTime();
    const result = formatDate(timestamp);
    expect(result).toContain('1月');
  });
});

describe('formatISODate', () => {
  it('should return YYYY-MM-DD format', () => {
    const date = new Date('2024-01-13T10:30:00Z');
    const result = formatISODate(date);
    expect(result).toBe('2024-01-13');
  });
});

// ==========================================
// 数据验证测试
// ==========================================

describe('isValidEmail', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('should accept passwords with minimum length', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('password123')).toBe(true);
  });

  it('should reject short passwords', () => {
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('')).toBe(false);
  });
});
