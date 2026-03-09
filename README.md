# Life Matrix v4

**现代化重构版本** - 基于 Vite + React + Tailwind CSS 构建，性能优化版 Life Matrix。

## 🚀 技术栈

- **构建工具**: Vite 7.3
- **前端框架**: React 18
- **样式**: Tailwind CSS v3 + PostCSS
- **认证 & 数据**: Firebase Auth + Firestore
- **图标**: Lucide React + 自定义 SVG 组件
- **状态管理**: React Hooks (useState, useEffect)
- **本地存储**: LocalStorage (离线优先)

## 📦 特性

### 性能优化
- ✅ 预编译构建（无浏览器端 JSX 编译）
- ✅ 代码分割 & Tree-shaking
- ✅ 生产构建 gzip 后仅 **125KB**（原版 ~800KB）
- ✅ 首屏加载 <1秒（原版 2-3秒）
- ✅ LocalStorage 先行渲染（Firebase 后台同步）

### 核心功能
- ✅ Google 登录 / 邮箱登录
- ✅ 游客模式（纯本地存储）
- ✅ 8 维度雷达图可视化
- ✅ 经验值 & 等级系统
- ✅ 平衡度算法
- ✅ 历史记录查看
- ✅ 实时数据同步（Firebase）

## 🛠️ 本地开发

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```
访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```
输出到 `dist/` 目录。

### 预览生产构建
```bash
npm run preview
```

## 📂 项目结构

```
Life-Matrix-v4/
├── src/
│   ├── components/         # React 组件
│   │   ├── Icon.jsx        # 图标组件库
│   │   ├── RadarChart.jsx  # 雷达图可视化
│   │   └── Modals/         # 模态框组件（待补全）
│   ├── hooks/              # 自定义 Hooks（待补全）
│   ├── utils/              # 工具函数
│   │   ├── algorithms.js   # 等级/平衡度算法
│   │   └── firebase.js     # Firebase 配置
│   ├── constants/          # 常量定义
│   │   └── initialDims.js  # 初始维度配置
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 入口文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── dist/                   # 构建输出（生产）
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 环境变量

Firebase 配置当前硬编码在 `src/utils/firebase.js` 中。
生产部署时建议使用环境变量：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
...
```

## 🚢 部署

### Vercel（推荐）
1. Import GitHub repo 到 Vercel
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. 部署完成！

### 其他平台
支持任何静态托管平台：Netlify, Cloudflare Pages, GitHub Pages 等。

## 📊 性能对比

| 指标 | v3.27 (单文件) | v4.0 (Vite) |
|------|----------------|-------------|
| 首屏加载 | 2-3秒 | <1秒 |
| Bundle Size | ~800KB | 125KB (gzipped) |
| 冷启动 | 依赖 CDN | 预编译 |
| 热重载 | 不支持 | ⚡ Vite HMR |
| 代码分割 | 否 | 是 |

## 🔧 待补全功能

- [ ] Settings Modal（维度编辑、标签管理）
- [ ] Monthly History Modal（月度历史）
- [ ] AI Review Panel（自动识别进展）
- [ ] Timeline 视图（时间轴）
- [ ] 数据导出（JSON/CSV）
- [ ] PWA 支持（Service Worker）
- [ ] 离线模式优化

## 📝 版本历史

### v4.0 (2026-02-27)
- 🎉 全新 Vite + React 重构
- ⚡ 性能飞跃：首屏加载从 3秒 降到 <1秒
- 📦 Bundle size 减少 85%
- 🔥 支持热重载开发
- 🧩 模块化组件架构

## 📄 License

Copyright (c) 2026 Fuzzy-and-Fluffy

All rights reserved.

Permission is granted to use, copy, and modify this software for personal and non-commercial purposes only.

---

**维护者**: Codie 💻  
**原作者**: Momo  
**GitHub**: [aureliadawne-pixel/Life-Matrix-v4](https://github.com/aureliadawne-pixel/Life-Matrix-v4) (待转移到 Fuzzy-and-Fluffy org)
