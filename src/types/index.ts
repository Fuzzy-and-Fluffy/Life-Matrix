/**
 * Life-Matrix 核心类型定义
 * @module types
 */

// ==========================================
// 维度相关类型
// ==========================================

/**
 * 维度配置对象
 * @description 描述一个人生领域的配置信息
 */
export interface Dimension {
  /** 维度唯一标识，格式: 'dim_N' (预设) 或 'c_timestamp' (自定义) */
  id: string;
  /** 维度名称，如 "身心健康" */
  name: string;
  /** 是否启用该维度 */
  active: boolean;
  /** Tailwind 背景色类名，如 "bg-emerald-400" */
  color: string;
  /** Tailwind 文字色类名，如 "text-emerald-500" */
  text: string;
  /** Tailwind 边框色类名，如 "border-emerald-100" */
  border: string;
}

// ==========================================
// 历史记录相关类型
// ==========================================

/**
 * 历史记录对象
 * @description 单条进度记录
 */
export interface HistoryRecord {
  /** 记录唯一标识 (可选，用于编辑/删除) */
  id?: string;
  /** 所属维度名称 */
  dimName: string;
  /** 维度背景色类名 */
  dimColor: string;
  /** 记录内容描述 */
  text: string;
  /** 标签数组，如 ["运动", "户外"] */
  tags: string[];
  /** 获得积分（固定为 1） */
  pts: number;
  /** 记录时间戳（毫秒） */
  timestamp: number;
  /** 格式化日期字符串，如 "2024/1/13 10:30" */
  dateStr: string;
}

// ==========================================
// 标签相关类型
// ==========================================

/**
 * 系统标签对象
 * @description 可重复使用的标签配置
 */
export interface SystemTag {
  /** 标签唯一标识，格式: 'tag_timestamp' */
  id: string;
  /** 标签名称 */
  name: string;
  /** 适用的维度 ID 数组，空数组表示适用所有维度 */
  appliesTo: string[];
}

// ==========================================
// 应用状态类型
// ==========================================

/**
 * 完整应用状态
 * @description 保存到 localStorage 和 Firestore 的数据结构
 */
export interface AppState {
  /** 用户昵称 */
  name: string;
  /** Base64 编码的头像图片 */
  avatar: string | null;
  /** 引导步骤 (1-4)，4 为主界面 */
  step: number;
  /** 维度配置数组 */
  dimensions: Dimension[];
  /** 各维度积分数组（与 dimensions 平行） */
  scores: number[];
  /** 历史记录数组 */
  history: HistoryRecord[];
  /** 系统标签数组 */
  systemTags: SystemTag[];
  /** 最近使用的标签（最多 10 个） */
  recentTags: string[];
  /** 最后更新时间 ISO 字符串 */
  updatedAt: string;
}

// ==========================================
// UI 状态类型
// ==========================================

/**
 * 同步状态枚举
 */
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline';

/**
 * 模态框类型枚举
 */
export type ModalType = 'record' | 'calendar' | 'settings' | 'auth' | 'aiReview' | null;

/**
 * 认证模式枚举
 */
export type AuthMode = 'login' | 'register';

// ==========================================
// 组件 Props 类型
// ==========================================

/**
 * Icon 组件 Props
 */
export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * RadarChart 组件 Props
 */
export interface RadarChartProps {
  dimensions: Dimension[];
  scores: number[];
  onLabelClick: (index: number) => void;
  size?: number;
}

/**
 * RecordModal 组件 Props
 */
export interface RecordModalProps {
  dimName: string;
  currentDimId?: string;
  onClose: () => void;
  onConfirm: (text: string, tags: string[]) => void;
  onDelete?: () => void;
  history: HistoryRecord[];
  systemTags: SystemTag[];
  recentTags: string[];
  initialText?: string;
  initialTags?: string[];
  initialDate?: number | null;
  isEdit?: boolean;
}

/**
 * SettingsModal 组件 Props
 */
export interface SettingsModalProps {
  onClose: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImport: (content: string) => void;
  name: string;
  avatar: string | null;
  dimensions: Dimension[];
  systemTags: SystemTag[];
  history: HistoryRecord[];
  onMigrateTags: () => void;
  onSave: (
    name: string,
    avatar: string | null,
    dimensions: Dimension[],
    systemTags: SystemTag[]
  ) => void;
  onSignOut: () => void;
  currentUser: FirebaseUser | null;
}

/**
 * MonthlyHistoryModal 组件 Props
 */
export interface MonthlyHistoryModalProps {
  onClose: () => void;
  history: HistoryRecord[];
  dimensions: Dimension[];
}

/**
 * AIReviewModal 组件 Props
 */
export interface AIReviewModalProps {
  onClose: () => void;
  history: HistoryRecord[];
  dimensions: Dimension[];
}

/**
 * AvatarCropModal 组件 Props
 */
export interface AvatarCropModalProps {
  imageSrc: string;
  onConfirm: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

// ==========================================
// Firebase 类型
// ==========================================

/**
 * Firebase 用户类型（简化版）
 */
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ==========================================
// Hook 返回类型
// ==========================================

/**
 * useAuth Hook 返回类型
 */
export interface UseAuthReturn {
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  authError: string;
  authMode: AuthMode;
  authEmail: string;
  authPassword: string;
  setAuthMode: (mode: AuthMode) => void;
  setAuthEmail: (email: string) => void;
  setAuthPassword: (password: string) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: () => Promise<void>;
  signUpWithEmail: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

/**
 * useDataSync Hook 返回类型
 */
export interface UseDataSyncReturn {
  syncStatus: SyncStatus;
  isNewUser: boolean;
  loadFromLocalStorage: () => AppState | null;
  saveToLocalStorage: (data: AppState) => void;
  syncToFirestore: (userId: string, data: AppState) => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<AppState | null>;
  ensureDataIntegrity: (data: Partial<AppState>, currentState: Partial<AppState>) => AppState;
}
