/**
 * useAuth Hook
 * @module hooks/useAuth
 * @description Firebase 认证状态管理 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import type { UseAuthReturn, FirebaseUser, AuthMode } from '@/types';
import { CONFIG, log } from '@/config';
import { isValidEmail, isValidPassword } from '@/utils';

// Firebase 类型（运行时从全局获取）
declare const firebase: any;

/**
 * useAuth Hook
 *
 * @description 管理用户认证状态和认证操作
 *
 * 功能特性：
 * - 监听 Firebase Auth 状态变化
 * - 提供 Google OAuth 登录
 * - 提供邮箱密码注册/登录
 * - 提供登出功能
 * - 统一错误处理
 *
 * @returns {UseAuthReturn} 认证状态和操作方法
 *
 * @example
 * const {
 *   currentUser,
 *   authLoading,
 *   signInWithGoogle,
 *   signOut
 * } = useAuth();
 *
 * if (authLoading) return <Loading />;
 * if (!currentUser) return <LoginForm />;
 * return <Dashboard user={currentUser} />;
 */
export const useAuth = (): UseAuthReturn => {
  // ==========================================
  // 状态定义
  // ==========================================

  /** 当前登录用户 */
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  /** 认证加载状态 */
  const [authLoading, setAuthLoading] = useState(true);

  /** 认证错误信息 */
  const [authError, setAuthError] = useState('');

  /** 认证模式：登录或注册 */
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  /** 邮箱输入 */
  const [authEmail, setAuthEmail] = useState('');

  /** 密码输入 */
  const [authPassword, setAuthPassword] = useState('');

  // ==========================================
  // 错误处理
  // ==========================================

  /**
   * 将 Firebase 错误码转换为中文提示
   */
  const getErrorMessage = (error: any): string => {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': '邮箱格式不正确',
      'auth/user-disabled': '该账户已被禁用',
      'auth/user-not-found': '用户不存在',
      'auth/wrong-password': '密码错误',
      'auth/email-already-in-use': '该邮箱已被注册',
      'auth/weak-password': '密码强度不足',
      'auth/network-request-failed': '网络连接失败，请检查网络',
      'auth/too-many-requests': '尝试次数过多，请稍后再试',
      'auth/popup-closed-by-user': '登录窗口已关闭',
    };

    return errorMessages[error.code] || `认证失败: ${error.message}`;
  };

  /**
   * 清除认证错误
   */
  const clearAuthError = useCallback(() => {
    setAuthError('');
  }, []);

  // ==========================================
  // 认证操作
  // ==========================================

  /**
   * Google OAuth 登录
   */
  const signInWithGoogle = useCallback(async (): Promise<void> => {
    try {
      setAuthLoading(true);
      clearAuthError();

      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);

      log('Google 登录成功');
    } catch (error: any) {
      const message = getErrorMessage(error);
      setAuthError(message);
      console.error('Google 登录失败:', error);
    } finally {
      setAuthLoading(false);
    }
  }, [clearAuthError]);

  /**
   * 邮箱密码登录
   */
  const signInWithEmail = useCallback(async (): Promise<void> => {
    // 验证输入
    if (!isValidEmail(authEmail)) {
      setAuthError('请输入有效的邮箱地址');
      return;
    }
    if (!isValidPassword(authPassword)) {
      setAuthError(`密码长度不能少于 ${CONFIG.LIMITS.MIN_PASSWORD_LENGTH} 位`);
      return;
    }

    try {
      setAuthLoading(true);
      clearAuthError();

      await firebase.auth().signInWithEmailAndPassword(authEmail, authPassword);

      log('邮箱登录成功');
    } catch (error: any) {
      const message = getErrorMessage(error);
      setAuthError(message);
      console.error('邮箱登录失败:', error);
    } finally {
      setAuthLoading(false);
    }
  }, [authEmail, authPassword, clearAuthError]);

  /**
   * 邮箱密码注册
   */
  const signUpWithEmail = useCallback(async (): Promise<void> => {
    // 验证输入
    if (!isValidEmail(authEmail)) {
      setAuthError('请输入有效的邮箱地址');
      return;
    }
    if (!isValidPassword(authPassword)) {
      setAuthError(`密码长度不能少于 ${CONFIG.LIMITS.MIN_PASSWORD_LENGTH} 位`);
      return;
    }

    try {
      setAuthLoading(true);
      clearAuthError();

      await firebase.auth().createUserWithEmailAndPassword(authEmail, authPassword);

      log('邮箱注册成功');
    } catch (error: any) {
      const message = getErrorMessage(error);
      setAuthError(message);
      console.error('邮箱注册失败:', error);
    } finally {
      setAuthLoading(false);
    }
  }, [authEmail, authPassword, clearAuthError]);

  /**
   * 登出
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await firebase.auth().signOut();
      setCurrentUser(null);
      log('登出成功');
    } catch (error: any) {
      console.error('登出失败:', error);
      setAuthError('登出失败，请重试');
    }
  }, []);

  // ==========================================
  // 监听认证状态
  // ==========================================

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        log('用户已登录:', user.email);
      } else {
        setCurrentUser(null);
        log('用户未登录');
      }
      setAuthLoading(false);
    });

    // 清理订阅
    return () => unsubscribe();
  }, []);

  // ==========================================
  // 返回值
  // ==========================================

  return {
    currentUser,
    authLoading,
    authError,
    authMode,
    authEmail,
    authPassword,
    setAuthMode,
    setAuthEmail,
    setAuthPassword,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clearAuthError,
  };
};

export default useAuth;
