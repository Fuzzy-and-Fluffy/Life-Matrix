/**
 * Icon 组件
 * @module components/ui/Icon
 * @description SVG 图标库，提供应用中使用的所有图标
 */

import type { IconProps } from '@/types';

/**
 * 图标映射表
 * @description 所有可用图标的 SVG 路径定义
 */
const icons: Record<string, JSX.Element> = {
  user: (
    <g>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </g>
  ),
  plus: (
    <g>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </g>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  camera: (
    <g>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </g>
  ),
  sparkle: (
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  history: (
    <g>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </g>
  ),
  scale: (
    <g>
      <path d="M16 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
      <path d="M12 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
      <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8" />
      <path d="M4 10h16" />
      <path d="M12 10v10" />
    </g>
  ),
  clock: (
    <g>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </g>
  ),
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  fast: <path d="m13 2-2 10h9L11 22l2-10H4L13 2Z" />,
  close: (
    <g>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </g>
  ),
  settings: (
    <g>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  download: (
    <g>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </g>
  ),
  upload: (
    <g>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </g>
  ),
  table: (
    <g>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="3" x2="21" y1="15" y2="15" />
      <line x1="12" x2="12" y1="3" y2="21" />
    </g>
  ),
  cloud: (
    <g>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </g>
  ),
  cloudOff: (
    <g>
      <path d="m2 2 20 20" />
      <path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" />
      <path d="M21.532 16.532A4.5 4.5 0 0 0 17.5 10h-1.79a7 7 0 0 0-1.926-3.535" />
    </g>
  ),
  google: (
    <g>
      <path
        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
        fill="currentColor"
        stroke="none"
      />
    </g>
  ),
  logout: (
    <g>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </g>
  ),
  edit: (
    <g>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </g>
  ),
  trash: (
    <g>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </g>
  ),
  folder: (
    <g>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </g>
  ),
};

/**
 * Icon 组件
 *
 * @description 渲染 SVG 图标，支持自定义大小和样式
 *
 * @param {IconProps} props - 组件属性
 * @param {string} props.name - 图标名称
 * @param {number} [props.size=20] - 图标大小（像素）
 * @param {string} [props.className=''] - 额外的 CSS 类名
 *
 * @example
 * <Icon name="settings" size={24} className="text-slate-600" />
 * <Icon name="plus" />
 */
export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name] || icons['user']}
    </svg>
  );
};

export default Icon;
