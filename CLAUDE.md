# CLAUDE.md - AI Assistant Guide for Life-Matrix

**Last Updated**: 2026-01-29
**Repository**: Fuzzy-and-Fluffy/Life-Matrix
**Primary Language**: Chinese (Simplified)
**Architecture**: Single-file React PWA

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [File Structure](#file-structure)
4. [Development Workflow](#development-workflow)
5. [Code Conventions](#code-conventions)
6. [Coding Standards & Best Practices](#coding-standards--best-practices)
7. [Data Models](#data-models)
8. [Common Tasks](#common-tasks)
9. [Testing Guidelines](#testing-guidelines)
10. [Git Workflow](#git-workflow)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Critical Points

⚠️ **IMPORTANT**: This is a **single-file application**. All React code lives in `index.html`.

- **Primary file**: `/home/user/Life-Matrix/index.html` (1639 lines)
- **No build process**: Changes are immediately testable in browser
- **No npm/node_modules**: All dependencies loaded via CDN
- **Language**: All UI text should be in Chinese (Simplified)

### 🤖 AI Assistant: Quick Workflow

**For each completed feature**:
1. ✅ Implement, test, commit, and push to feature branch
2. 📝 Generate PR link and pre-filled details
3. 🔗 Provide GitHub PR creation link to user
4. ✨ User creates PR from mobile/web browser

👉 **See [Creating Pull Requests - AI Assistant Workflow](#ai-assistant-workflow-claude-code)** for detailed instructions

### Technology Stack

```
Frontend:      React 18 (via CDN) + Tailwind CSS
Backend:       Firebase (Auth + Firestore)
Storage:       Cloud Firestore + localStorage
PWA:           Service Worker (sw.js) + manifest.json
Deployment:    Vercel (lifematrix.vercel.app)
```

---

## Architecture Overview

### Single-File Application Pattern

Life-Matrix uses an unconventional but pragmatic architecture:

```
┌─────────────────────────────────────┐
│         index.html (1639 lines)     │
├─────────────────────────────────────┤
│  HTML Head (CDN imports, meta tags) │
│  Service Worker Registration        │
│  Firebase Configuration             │
│  Constants & Algorithms             │
│  React Components (inline JSX)      │
│  Main App Component                 │
│  ReactDOM.render()                  │
└─────────────────────────────────────┘
```

**Why this matters for AI assistants**:
- ✅ All code edits happen in ONE file
- ✅ No import/export statements to manage
- ✅ No build step to worry about
- ❌ Don't try to split into modules
- ❌ Don't suggest npm packages
- ❌ Don't create separate .js/.css files

### Component Hierarchy

```
App (Main Component)
├── Icon (SVG icon library)
├── RadarChart (Spider/radar visualization)
├── RecordModal (Create/edit progress records)
│   └── Tag selection UI
├── SettingsModal (Multi-tab settings)
│   ├── Profile tab
│   ├── Dimensions tab
│   ├── Tags tab
│   └── Data export/import tab
└── MonthlyHistoryModal (Calendar heatmap)
```

---

## File Structure

```
/home/user/Life-Matrix/
├── index.html           # ENTIRE APPLICATION (1639 lines)
├── sw.js               # Service Worker (cache: v3.12)
├── manifest.json       # PWA manifest
├── icon-192.png        # PWA icon (192x192)
├── icon-512.png        # PWA icon (512x512)
├── README.md           # User documentation (Chinese)
├── DEPLOYMENT.md       # Deployment guide
└── .gitignore          # Git ignore rules
```

### Key File Sections in index.html

| Lines | Content |
|-------|---------|
| 1-69 | HTML head: meta tags, CDN imports, Tailwind |
| 70-165 | PWA registration, Icon component |
| 106-130 | Firebase config & initialization |
| 131-203 | Constants, level/balance algorithms |
| 204-811 | React components (RadarChart, Modals) |
| 890-1633 | Main App component |
| 1635-1637 | ReactDOM rendering |

---

## Development Workflow

### Making Changes

1. **Read before editing**: Always read `index.html` before making changes
2. **Edit the file**: Use the Edit tool to modify specific sections
3. **Update service worker**: Bump cache version in `sw.js` if needed
4. **Test locally**: Open `index.html` directly in browser
5. **Commit changes**: Follow git workflow below
6. **Push to branch**: Always to `claude/*` branches

### Service Worker Version Management

**When to bump SW cache version** (`sw.js` line 1):

✅ **MUST bump** when:
- Modifying `index.html` functionality
- Changing UI layout or styles
- Updating Firebase configuration
- Fixing bugs that affect cached content

❌ **Don't bump** when:
- Only adding comments
- Updating documentation files
- Making backend-only changes

**How to bump**:
```javascript
// Change this line in sw.js:
const CACHE_NAME = 'lifematrix-v3.12'; // increment: v3.13, v3.14, etc.
```

### Testing Checklist

Since there's no automated testing:

- [ ] Open `index.html` in browser (Chrome/Firefox)
- [ ] Test user flow affected by changes
- [ ] Test both authenticated and unauthenticated states
- [ ] Test offline mode (disable network in DevTools)
- [ ] Test mobile viewport (DevTools responsive mode)
- [ ] Check browser console for errors
- [ ] Verify Firebase operations work
- [ ] Test data export/import if data model changed

---

## Code Conventions

### JavaScript Style

```javascript
// Component names: PascalCase
const RadarChart = ({ dimensions, scores, onSegmentClick }) => { ... };

// Functions and variables: camelCase
const calculateLevel = (score) => { ... };
const syncStatus = 'syncing';

// Constants: SCREAMING_SNAKE_CASE
const INITIAL_DIMENSIONS = [ ... ];
const MAX_DIMENSIONS = 8;

// Dimension IDs: 'dim_N' or 'c_timestamp'
{ id: 'dim_1', name: '身心健康' }
{ id: 'c_1705123456789', name: 'Custom Dimension' }

// Tag IDs: 'tag_timestamp'
{ id: 'tag_1705123456789', name: '工作', appliesTo: [] }
```

### Naming Patterns

| Type | Pattern | Example |
|------|---------|---------|
| State variables | camelCase | `currentUser`, `authLoading` |
| Event handlers | `handle*` or `on*` | `handleLogin`, `onSegmentClick` |
| Boolean variables | `is*`, `has*`, `should*` | `isLoading`, `hasAvatar` |
| Modal types | lowercase strings | `'record'`, `'settings'`, `'auth'` |

### React Patterns

```javascript
// State management: useState hooks
const [name, setName] = React.useState('');
const [scores, setScores] = React.useState([0, 0, 0, 0, 0, 0]);

// Side effects: useEffect hooks
React.useEffect(() => {
  // Load from localStorage on mount
  const saved = localStorage.getItem('life_matrix_v34_csv');
  if (saved) {
    const data = JSON.parse(saved);
    setName(data.name || '');
  }
}, []);

// Memoization: useMemo for expensive calculations
const totalScore = React.useMemo(() =>
  scores.reduce((sum, s) => sum + s, 0),
  [scores]
);

// Refs: useRef for DOM access
const fileInputRef = React.useRef(null);
```

### Styling with Tailwind

```javascript
// All styles use Tailwind utility classes
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
    <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
      确定
    </button>
  </div>
</div>

// Dimension colors use Tailwind classes stored as strings
{
  color: "bg-emerald-400",
  text: "text-emerald-500",
  border: "border-emerald-100"
}
```

### Error Handling

```javascript
// Firebase operations: try-catch with Chinese error messages
try {
  await firebase.firestore().collection('users').doc(uid).set(data);
  setSyncStatus('synced');
} catch (error) {
  console.error('保存失败:', error);
  alert('保存失败，请检查网络连接');
  setSyncStatus('offline');
}

// LocalStorage: always provide fallback
try {
  const saved = localStorage.getItem('life_matrix_v34_csv');
  return saved ? JSON.parse(saved) : getDefaultState();
} catch (error) {
  console.error('读取本地数据失败:', error);
  return getDefaultState();
}
```

---

## Coding Standards & Best Practices

### 1. 核心原则 (Core Principles)

- **KISS (Keep It Simple, Stupid)**: 优先选择最简单的实现方式。单文件架构本身就是 KISS 的最佳实践。除非绝对必要，否则不要引入复杂的抽象或设计模式。
- **DRY (Don't Repeat Yourself)**: 提取重复的逻辑到函数或组件中，但要注意不要过度抽象导致代码难以阅读。
- **单一职责 (Single Responsibility)**: 一个函数或组件只做一件事。如果一个函数超过 50 行，请考虑拆分。
- **函数式优先 (Functional Preference)**: 优先使用纯函数和 React Functional Components。避免副作用（Side Effects）和全局状态变更。

### 2. 代码风格与质量 (Code Style & Quality)

- **命名规范**:
  - 变量名必须是描述性的 (Descriptive)。
  - ❌ `const d = new Date()`
  - ✅ `const creationDate = new Date()`
  - Boolean 变量应以 `is`, `has`, `should`, `can` 开头 (e.g., `isVisible`, `hasLoaded`).
  
- **尽早返回 (Early Returns)**: 使用 Guard Clauses 避免深层嵌套。
  - ❌ `if (user) { if (active) { ... } }`
  - ✅ `if (!user) return; if (!active) return; ...`

- **类型注释 (JSDoc)**: 由于项目使用纯 JavaScript，使用 JSDoc 注释描述复杂函数的参数类型：
  ```javascript
  /**
   * 计算用户等级
   * @param {number} score - 用户得分
   * @returns {number} 等级数值
   */
  const calculateLevel = (score) => Math.floor(-2 + Math.sqrt(4 + score));
  ```

- **代码格式**:
  - 优先使用 `const`，必要时使用 `let`，禁止使用 `var`
  - 使用 `async/await` 代替 `.then().catch()` 链式调用
  - 字符串优先使用模板字符串 `` `${variable}` ``

### 3. 错误处理与日志 (Error Handling & Logging)

- **防御性编程**: 永远不要假设输入是正确的。验证所有外部数据（API 响应、用户输入、文件导入）。

- **不要吞掉错误**:
  - ❌ `try { ... } catch (e) {}` (绝对禁止)
  - ✅ `try { ... } catch (e) { console.error('操作失败:', e); alert('操作失败，请重试'); }`

- **调试日志规范**:
  ```javascript
  // 开发调试时可以使用 console.log
  console.log("CSV Header:", header); // 调试用
  
  // 生产环境建议使用条件日志
  const DEBUG = false; // 发布前设为 false
  if (DEBUG) console.log('[DEBUG] State update:', { name, scores });
  
  // 错误日志必须保留
  console.error('保存失败:', error); // 这个要保留
  ```

### 4. 安全性 (Security)

- **Firebase 配置说明**: Firebase API Key 在代码中是公开的，这是设计如此。安全性由 Firestore Security Rules 保证，而非 API Key 保密。

- **输入验证**: 验证所有用户输入和文件导入。参考 `handleImport` 函数的实现。

- **XSS 防护**: 
  - ✅ React 默认转义是安全的：`<div>{userInput}</div>`
  - ❌ 避免使用 `dangerouslySetInnerHTML`

- **环境变量**: 本项目无需环境变量，所有配置直接在代码中。如果未来需要私密配置，使用 Vercel 环境变量。

### 5. 技术栈特定规范 (Tech Stack Specifics)

#### React (via CDN, no build process)
- 使用 Functional Components 和 Hooks
- 所有 React API 通过全局对象访问：`React.useState`, `React.useEffect` 等
- 组件定义使用 `const ComponentName = (props) => { ... }`
- Props 通过解构获取：`const Modal = ({ onClose, title, children }) => { ... }`

#### Tailwind CSS
- 所有样式使用 Tailwind 工具类
- 颜色方案存储为字符串：`{ color: "bg-emerald-400", text: "text-emerald-500" }`
- 响应式设计使用 Tailwind 断点：`md:`, `lg:`, etc.

#### Firebase
- 使用 compat 版本 SDK（兼容旧语法）
- 所有 Firebase 操作包裹在 try-catch 中
- 同步状态反馈给用户：`setSyncStatus('syncing' | 'synced' | 'offline')`

#### SheetJS (XLSX)
- 用于 Excel 文件解析导入
- 通过 CDN 引入，使用全局 `XLSX` 对象
- 转换 Excel 为 CSV 后再处理：`XLSX.utils.sheet_to_csv(worksheet)`

### 6. AI 协作指令 (Instructions for AI)

- **不要过度重构**: 仅在修改现有代码块时应用这些规则，不要为了符合规则而重写整个未触及的文件。

- **解释你的决定**: 如果你选择了一种复杂的实现方式，请在注释中解释"为什么"。

- **引用已有库**: 优先使用项目中已加载的库（React、Firebase、SheetJS、Tailwind），不要引入新的 CDN 依赖，除非必须且已与用户确认。

- **保持单文件架构**: 不要尝试将代码拆分为多个文件，不要建议使用 npm 包。

- **维护中文界面**: 所有用户可见的文本必须是简体中文。

---

## Data Models

### Core State Structure

```javascript
{
  // User Profile
  name: string,              // "张三"
  avatar: string,            // "data:image/png;base64,..."
  step: number,              // 1-4 (onboarding progress)

  // Dimensions (6-8 customizable areas)
  dimensions: Array<{
    id: string,              // "dim_1" or "c_1705123456789"
    name: string,            // "身心健康"
    active: boolean,         // true if enabled
    color: string,           // "bg-emerald-400"
    text: string,            // "text-emerald-500"
    border: string           // "border-emerald-100"
  }>,

  // Scores (parallel array to dimensions)
  scores: number[],          // [10, 15, 8, 12, 9, 7]

  // History (chronological records)
  history: Array<{
    dimName: string,         // "身心健康"
    dimColor: string,        // "bg-emerald-400"
    text: string,            // "今天跑步5公里"
    tags: string[],          // ["运动", "户外"]
    pts: number,             // 1 (always 1 point per record)
    timestamp: number,       // 1705123456789
    dateStr: string          // "2024/1/13 10:30"
  }>,

  // System Tags
  systemTags: Array<{
    id: string,              // "tag_1705123456789"
    name: string,            // "工作"
    appliesTo: string[]      // ["dim_1", "dim_2"] or [] for all
  }>
}
```

### Default Dimensions

```javascript
const INITIAL_DIMENSIONS = [
  { id: 'dim_1', name: '身心健康', color: 'bg-emerald-400', text: 'text-emerald-500', border: 'border-emerald-100' },
  { id: 'dim_2', name: '家庭生活', color: 'bg-rose-400', text: 'text-rose-500', border: 'border-rose-100' },
  { id: 'dim_3', name: '职业发展', color: 'bg-blue-400', text: 'text-blue-500', border: 'border-blue-100' },
  { id: 'dim_4', name: '学习提升', color: 'bg-violet-400', text: 'text-violet-500', border: 'border-violet-100' },
  { id: 'dim_5', name: '社交人际', color: 'bg-amber-400', text: 'text-amber-500', border: 'border-amber-100' },
  { id: 'dim_6', name: '兴趣爱好', color: 'bg-pink-400', text: 'text-pink-500', border: 'border-pink-100' }
];
```

### Algorithms

**Level Calculation** (quadratic progression):
```javascript
const calculateLevel = (score) => Math.floor(-2 + Math.sqrt(4 + score));
// Level 1: 0-4 pts
// Level 2: 5-10 pts
// Level 3: 11-18 pts
// Level 4: 19-28 pts
// Formula: points needed = level² + 4*level
```

**Balance Calculation** (coefficient of variation):
```javascript
const calculateBalance = (scores) => {
  const activeScores = scores.filter((_, i) => dimensions[i].active);
  const mean = activeScores.reduce((a, b) => a + b, 0) / activeScores.length;
  const variance = activeScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / activeScores.length;
  const stdDev = Math.sqrt(variance);
  return Math.max(0, 100 - (stdDev / mean) * 100);
};
// Returns 0-100, where 100 = perfectly balanced
```

---

## Common Tasks

### Adding a New Feature

1. **Locate the relevant section** in `index.html`
2. **Add/modify component** or add new function
3. **Update state** if needed (add new useState)
4. **Add UI elements** using Tailwind classes
5. **Maintain Chinese language** for all user-facing text
6. **Test thoroughly** (see Testing Checklist)
7. **Bump SW version** if user-visible changes
8. **Commit with descriptive message**

### Adding a New Modal

```javascript
// 1. Add modal type to state
const [modalType, setModalType] = React.useState(null); // 'record' | 'settings' | 'newModal' | null

// 2. Create modal component
const NewModal = ({ onClose, ...props }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6">
      <h2 className="text-xl font-bold mb-4">标题</h2>
      {/* Modal content */}
      <button onClick={onClose} className="mt-4 w-full bg-sky-500 text-white py-2 rounded-lg">
        关闭
      </button>
    </div>
  </div>
);

// 3. Add to App render
{modalType === 'newModal' && <NewModal onClose={() => setModalType(null)} />}
```

### Modifying the Data Model

⚠️ **CRITICAL**: Changing data structure affects:
- localStorage key (currently `'life_matrix_v34_csv'`)
- Firebase Firestore documents
- Existing user data migration

**Safe approach**:
1. Read existing data format
2. Create migration function
3. Update localStorage key version if breaking change
4. Test with existing data
5. Provide fallback for old format

```javascript
// Example migration
const loadUserData = () => {
  const saved = localStorage.getItem('life_matrix_v34_csv');
  if (saved) {
    const data = JSON.parse(saved);
    // Migrate old format
    if (!data.systemTags) {
      data.systemTags = []; // Add new field
    }
    return data;
  }
  return getDefaultState();
};
```

### Adding a New Default Dimension

```javascript
// Only add to INITIAL_DIMENSIONS if for new users
// For existing users, let them add custom dimensions via UI

const INITIAL_DIMENSIONS = [
  // ... existing 6 dimensions
  {
    id: 'dim_7',
    name: '财富管理',
    active: true,
    color: 'bg-teal-400',
    text: 'text-teal-500',
    border: 'border-teal-100'
  }
];
```

### Implementing New UI Text

All user-facing text must be in Chinese:

```javascript
// ✅ Good
<button>保存</button>
<p>请输入您的姓名</p>
alert('保存成功！');

// ❌ Bad
<button>Save</button>
<p>Please enter your name</p>
alert('Saved successfully!');
```

**Common translations**:
- Save: 保存
- Cancel: 取消
- Confirm: 确认
- Delete: 删除
- Edit: 编辑
- Add: 添加
- Success: 成功
- Error: 错误
- Loading: 加载中

---

## Testing Guidelines

### Manual Testing Protocol

Since there's no automated testing infrastructure:

**1. Component Testing**
```
✓ Does the new feature render correctly?
✓ Do buttons respond to clicks?
✓ Are forms validating input?
✓ Do modals open and close properly?
```

**2. State Management Testing**
```
✓ Is state updating correctly?
✓ Are side effects (useEffect) triggering appropriately?
✓ Is localStorage being updated?
✓ Is Firebase syncing if authenticated?
```

**3. Cross-Browser Testing**
```
✓ Chrome (primary target)
✓ Firefox
✓ Safari (if accessible)
✓ Mobile browsers (Chrome mobile, Safari iOS)
```

**4. Responsive Testing**
```
✓ Mobile (375px width)
✓ Tablet (768px width)
✓ Desktop (1440px width)
```

**5. Offline Testing**
```
✓ Disable network in DevTools
✓ Verify Service Worker serves cached version
✓ Verify localStorage persistence works
✓ Check sync status updates appropriately
```

**6. Authentication Flow Testing**
```
✓ Guest mode (no auth)
✓ Google OAuth login
✓ Email/password registration
✓ Email/password login
✓ Logout
✓ Data persistence across sessions
```

### Debugging Tips

```javascript
// Add debug logging
console.log('[DEBUG] State update:', { name, scores, history });

// Check localStorage
console.log(localStorage.getItem('life_matrix_v34_csv'));

// Check Firebase connection
firebase.firestore().collection('users').doc('test').get()
  .then(() => console.log('Firebase connected'))
  .catch(err => console.error('Firebase error:', err));

// Monitor Service Worker
navigator.serviceWorker.getRegistration()
  .then(reg => console.log('SW state:', reg?.active?.state));
```

---

## Git Workflow

### Branch Naming Convention

**CRITICAL**: All Claude branches must follow this pattern:
```
claude/<description>-<session-id>
```

Current session branch: `claude/add-claude-documentation-0m1Dp`

**Examples**:
- `claude/fix-radar-chart-bug-a1B2c`
- `claude/add-export-feature-xY3zK`
- `claude/improve-mobile-ui-9mN4p`

### Commit Message Format

Use conventional commits style with Chinese descriptions:

```bash
# Format
<type>: <description in Chinese>

# Types
feat:     新功能 (new feature)
fix:      修复 (bug fix)
docs:     文档 (documentation)
style:    样式 (formatting, no code change)
refactor: 重构 (refactoring)
perf:     性能优化 (performance)
test:     测试 (tests)
chore:    杂项 (maintenance)

# Examples
git commit -m "feat: 添加系统标签管理功能"
git commit -m "fix: 修复移动端编辑按钮显示问题"
git commit -m "docs: 更新部署文档"
git commit -m "refactor: 优化雷达图渲染逻辑"
```

### Standard Git Operations

**Creating a branch**:
```bash
git checkout -b claude/feature-description-0m1Dp
```

**Committing changes**:
```bash
git add index.html sw.js
git commit -m "$(cat <<'EOF'
feat: 添加新功能

详细描述改动内容
EOF
)"
```

**Pushing to remote**:
```bash
# First push (set upstream)
git push -u origin claude/feature-description-0m1Dp

# Subsequent pushes
git push
```

**Retry logic for network failures**:
If push fails, retry with exponential backoff:
```bash
# Try 1
git push || sleep 2

# Try 2
git push || sleep 4

# Try 3
git push || sleep 8

# Try 4
git push || sleep 16
```

### Creating Pull Requests

#### AI Assistant Workflow (Claude Code)

**IMPORTANT**: When working in Claude Code (mobile or web), follow this workflow for EACH completed feature:

**Step 1: Complete the feature**
- Implement the requested functionality
- Test thoroughly
- Commit changes with descriptive message
- Push to feature branch (`claude/<description>-<session-id>`)

**Step 2: Rebase on main (if main has been updated)**
```bash
# Fetch latest main
git checkout main
git pull origin main

# Rebase feature branch
git checkout claude/<description>-<session-id>
git rebase main

# Force push (only on feature branches)
git push -f origin claude/<description>-<session-id>
```

**Step 3: Generate PR link and details**
```bash
# Check commits to be merged
git log origin/main..HEAD --oneline

# Generate GitHub PR URL
echo "https://github.com/Fuzzy-and-Fluffy/Life-Matrix/compare/main...claude/<description>-<session-id>"
```

**Step 4: Provide to user**

Provide the user with:
1. ✅ **GitHub PR creation link** (pre-filled)
2. 📝 **Suggested PR title** (in Chinese, following conventional commits)
3. 📋 **Suggested PR description** with:
   - 问题描述 (Problem description)
   - 解决方案 (Solution)
   - 技术细节 (Technical details)
   - 测试计划 (Test plan)
   - 影响范围 (Impact scope)

**Example output to user**:
```markdown
## 📋 PR 信息

**分支**: `claude/fix-avatar-loss-59wXy`
**Commit**: `c98bcc9` - 修复头像和名字在数据同步时丢失的问题

**创建 PR 的链接**:
https://github.com/Fuzzy-and-Fluffy/Life-Matrix/compare/main...claude/fix-avatar-loss-59wXy

---

## 📝 建议的 PR 标题和描述

**标题**:
fix: 修复头像和名字在数据同步时丢失的问题

**描述**:
## 问题描述
用户重新填写头像和名字后，在 PWA 重新登录时数据消失。

## 解决方案
1. 智能合并策略：优先保留非空值
2. 多层保护机制
3. 新增数据完整性检查函数

## 技术细节
- 修改 syncWithFirestore 函数
- 在 saveData 中集成完整性检查
- 更新 Service Worker 至 v3.23

## 测试
- [x] 本地测试数据同步流程
- [x] 验证修复有效

点击上面的链接即可创建 PR！🎉
```

**Why this workflow**:
- ✅ User can create PR from mobile/web browser
- ✅ Pre-filled details save time
- ✅ Clear tracking of each feature
- ✅ Easy to review and merge
- ✅ Works on any device

---

#### Traditional Workflow (with GitHub CLI)

If `gh` CLI is available, use this method:

```bash
# Check current branch status
git status
git log --oneline -5

# View diff from main
git diff main...HEAD

# Create PR
gh pr create --title "功能：添加系统标签管理" --body "$(cat <<'EOF'
## 概述
- 添加系统标签管理界面
- 支持创建、编辑、删除系统标签
- 标签可以指定应用范围

## 测试计划
- [ ] 创建新标签
- [ ] 编辑现有标签
- [ ] 删除标签
- [ ] 测试标签应用范围
EOF
)"
```

---

## Deployment

### Vercel Deployment (Current)

**Production URL**: https://lifematrix.vercel.app

**Deployment Process**:
1. Push to main branch (via PR merge)
2. Vercel auto-deploys
3. No build step required
4. Takes ~30 seconds

**Manual Deployment**:
```bash
# If vercel CLI is installed
vercel --prod
```

### Alternative Hosting Options

**GitHub Pages**:
```bash
# Enable in repo settings
# Set source to main branch
# Site available at: https://fuzzy-and-fluffy.github.io/Life-Matrix/
```

**Netlify**:
```bash
# Drop folder in Netlify UI
# Or connect repo for auto-deploy
```

**Cloudflare Pages**:
```bash
# Connect repo
# Build command: (none)
# Output directory: /
```

### Pre-Deployment Checklist

- [ ] Service Worker cache version bumped
- [ ] All features tested locally
- [ ] No console errors in browser DevTools
- [ ] Firebase operations working
- [ ] Mobile responsive layout verified
- [ ] Offline mode tested
- [ ] PWA install tested (Add to Home Screen)
- [ ] Icons (192px, 512px) present and correct
- [ ] manifest.json configured properly

---

## Troubleshooting

### Common Issues

**Issue**: Changes not reflecting in browser
**Solution**:
1. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Bump Service Worker version in `sw.js`
4. Unregister SW in DevTools → Application → Service Workers

**Issue**: Firebase auth not working
**Solution**:
1. Check Firebase console for domain whitelist
2. Verify API keys in `index.html` line 106-130
3. Check browser console for CORS errors
4. Ensure HTTPS is enabled (required for Firebase auth)

**Issue**: LocalStorage quota exceeded
**Solution**:
1. localStorage limit is ~5-10MB per domain
2. Implement data compression if history grows large
3. Provide option to export/delete old records
4. Consider pagination for history display

**Issue**: Radar chart not rendering
**Solution**:
1. Check that all dimensions have `active: true`
2. Verify scores array length matches dimensions length
3. Check browser console for SVG errors
4. Ensure parent container has defined dimensions

**Issue**: PWA not installing
**Solution**:
1. Must be served over HTTPS (localhost okay for dev)
2. Check `manifest.json` is valid JSON
3. Verify Service Worker is registered successfully
4. Icons must be correct size (192px, 512px)
5. Check browser console for PWA install criteria

**Issue**: Data not syncing to Firebase
**Solution**:
1. Check user authentication status
2. Verify Firebase rules allow write access
3. Check network tab for Firestore requests
4. Look for quota exceeded errors in console
5. Verify `syncStatus` state updates

### Debug Mode

To enable verbose logging, add to `index.html`:

```javascript
// After Firebase initialization (line ~130)
const DEBUG = true;

// Throughout code
if (DEBUG) {
  console.log('[App] State updated:', { name, scores, history });
  console.log('[Firebase] Syncing data...');
  console.log('[LocalStorage] Saving data...');
}
```

---

## Performance Considerations

### Current Performance Characteristics

- **Initial load**: ~300-500ms (CDN dependencies)
- **localStorage read/write**: <10ms
- **Firebase sync**: 200-1000ms (network dependent)
- **Radar chart render**: <50ms
- **Modal animations**: 60fps (CSS transforms)

### Optimization Guidelines

**When adding features, consider**:

1. **Bundle size**: Keep `index.html` under 200KB
2. **Render performance**: Use React.memo for expensive components
3. **State updates**: Batch related setState calls
4. **Firebase reads**: Minimize unnecessary queries
5. **localStorage**: Debounce writes (currently immediate)

**Don't prematurely optimize**:
- Single-file architecture is intentionally simple
- Performance is already excellent for this use case
- Only optimize if actual issues arise

---

## Feature Implementation Examples

### Adding a New Stat Display

```javascript
// 1. Calculate in useMemo
const averageLevel = React.useMemo(() => {
  const activeScores = scores.filter((_, i) => dimensions[i].active);
  const levels = activeScores.map(calculateLevel);
  return (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1);
}, [scores, dimensions]);

// 2. Add to UI
<div className="text-center">
  <div className="text-3xl font-bold text-sky-600">{averageLevel}</div>
  <div className="text-sm text-slate-500">平均等级</div>
</div>
```

### Adding a Settings Tab

```javascript
// In SettingsModal component
const [activeTab, setActiveTab] = React.useState('profile');

// Add tab button
<button
  onClick={() => setActiveTab('newTab')}
  className={`px-4 py-2 rounded-lg ${
    activeTab === 'newTab'
      ? 'bg-sky-500 text-white'
      : 'text-slate-600 hover:bg-slate-100'
  }`}
>
  新标签页
</button>

// Add tab content
{activeTab === 'newTab' && (
  <div className="space-y-4">
    <h3 className="font-bold text-lg">新功能设置</h3>
    {/* Settings content */}
  </div>
)}
```

### Adding Data Export Format

```javascript
// In exportData function
const exportAsYAML = () => {
  const data = {
    profile: { name, avatar },
    dimensions: dimensions.map(d => ({ id: d.id, name: d.name })),
    scores: scores,
    history: history.map(h => ({
      dimension: h.dimName,
      text: h.text,
      date: h.dateStr
    }))
  };

  // Simple YAML-like format
  const yaml = Object.entries(data)
    .map(([key, value]) => `${key}:\n  ${JSON.stringify(value, null, 2)}`)
    .join('\n\n');

  const blob = new Blob([yaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lifematrix-${Date.now()}.yaml`;
  a.click();
};
```

---

## Firebase Configuration

### Current Setup

**Project**: life-matrix-c6b45
**Services Used**:
- Authentication (Google OAuth + Email/Password)
- Cloud Firestore (database)

**Firestore Structure**:
```
users/
  {userId}/
    name: string
    avatar: string
    dimensions: array
    scores: array
    history: array
    systemTags: array
    lastModified: timestamp
```

### Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### API Keys

⚠️ **Note**: Firebase API keys in `index.html` are public by design. Security is enforced by Firestore rules, not API key secrecy.

### Quota Limits (Free Plan)

- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day
- **Storage**: 1 GB

Current usage is very low; unlikely to hit limits with normal use.

---

## Accessibility Considerations

### Current Status

The app has basic accessibility but could be improved:

**✓ Good**:
- Semantic HTML structure
- Adequate color contrast (Tailwind defaults)
- Touch-friendly button sizes
- Mobile responsive layout

**⚠️ Needs improvement**:
- No ARIA labels on interactive elements
- No keyboard navigation for modals
- No focus management
- No screen reader testing

### Improvement Guidelines

When adding features:

```javascript
// Add ARIA labels
<button aria-label="关闭对话框" onClick={onClose}>
  <Icon name="close" />
</button>

// Add keyboard handlers
const handleKeyDown = (e) => {
  if (e.key === 'Escape') onClose();
  if (e.key === 'Enter') handleSubmit();
};

// Add focus trap in modals
React.useEffect(() => {
  const modal = modalRef.current;
  if (modal) modal.focus();
}, []);

// Use semantic HTML
<nav aria-label="主导航">
  <button role="tab" aria-selected={activeTab === 'profile'}>
    个人资料
  </button>
</nav>
```

---

## Internationalization (i18n)

### Current Language: Chinese (Simplified)

The app is currently Chinese-only. All text is hardcoded in components.

### If Adding i18n Support

**Recommended approach**:

```javascript
// 1. Define translations object
const translations = {
  'zh-CN': {
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    // ... all strings
  },
  'en-US': {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    // ... all strings
  }
};

// 2. Create translation function
const [locale, setLocale] = React.useState('zh-CN');
const t = (key) => translations[locale][key] || key;

// 3. Use in components
<button>{t('save')}</button>
```

**Note**: This is not currently implemented. Keep all UI text in Chinese unless explicitly requested to add i18n.

---

## Security Best Practices

### Current Security Measures

✓ **Firebase Firestore Rules**: User isolation
✓ **HTTPS**: Required for PWA and Firebase
✓ **Input sanitization**: Basic validation on forms
✓ **localStorage**: No sensitive data stored
✓ **No eval()**: Safe JSX transpilation via Babel

### When Adding Features

**DO**:
- Validate all user input (especially file uploads, text fields)
- Use Firebase Security Rules to enforce data access
- Sanitize HTML if rendering user content (use textContent, not innerHTML)
- Implement rate limiting for Firebase operations if needed
- Keep Firebase SDK updated

**DON'T**:
- Store passwords or secrets in localStorage
- Execute user-provided JavaScript
- Trust client-side validation alone
- Expose internal implementation details in error messages
- Use innerHTML with unsanitized user input

### XSS Prevention

```javascript
// ✅ Safe (React escapes by default)
<div>{userInput}</div>
<input value={userInput} />

// ⚠️ Potentially unsafe
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Avoid!

// ✅ If HTML needed, sanitize first
import DOMPurify from 'dompurify'; // (not currently imported)
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

---

## Future Considerations

### Potential Improvements

These are NOT currently implemented, but may be requested:

1. **Testing infrastructure**: Jest + React Testing Library
2. **TypeScript migration**: Add type safety
3. **Build process**: Webpack/Vite for optimization
4. **Component library**: Extract reusable components
5. **State management**: Redux/Zustand for complex state
6. **Analytics**: Track usage patterns
7. **Notifications**: Push notifications via Service Worker
8. **Social features**: Share progress with friends
9. **Themes**: Dark mode, custom color schemes
10. **Data visualization**: More chart types (line, bar, etc.)

### Migration Path (If Needed)

If the app grows too large for single-file architecture:

1. **Phase 1**: Split into modules with ES6 imports
2. **Phase 2**: Add build process (Vite recommended)
3. **Phase 3**: Migrate to TypeScript
4. **Phase 4**: Add testing infrastructure
5. **Phase 5**: Consider framework migration (Next.js, etc.)

**But**: Only do this if truly necessary. Current architecture is sufficient for current scope.

---

## Quick Reference

### File Edit Checklist

- [ ] Read `index.html` first
- [ ] Make targeted edits (don't rewrite large sections)
- [ ] Maintain Chinese language for UI text
- [ ] Use Tailwind classes for styling
- [ ] Test in browser
- [ ] Bump SW version if needed
- [ ] Commit with descriptive message
- [ ] Push to `claude/*` branch

### Emergency Rollback

```bash
# Find last good commit
git log --oneline -10

# Reset to that commit
git reset --hard <commit-hash>

# Force push (ONLY if on claude/* branch)
git push --force
```

### Getting Help

**Documentation files**:
- `/home/user/Life-Matrix/README.md` - User guide (Chinese)
- `/home/user/Life-Matrix/DEPLOYMENT.md` - Deployment instructions
- `/home/user/Life-Matrix/CLAUDE.md` - This file

**External resources**:
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

## Glossary

| Term | Chinese | Meaning |
|------|---------|---------|
| Dimension | 维度 | Life area being tracked (e.g., health, career) |
| Record | 记录 | Single progress entry with text and points |
| Score | 分数 | Total points accumulated in a dimension |
| Level | 等级 | Calculated from score using quadratic formula |
| Balance | 平衡度 | Statistical measure of even development |
| Tag | 标签 | Categorization label for records |
| System Tag | 系统标签 | Reusable tag with optional dimension scope |
| Step | 步骤 | Onboarding progress (1-4) |
| Sync Status | 同步状态 | Firebase sync state: idle/syncing/synced/offline |

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-29 | 1.2.0 | 添加 AI Assistant PR 创建工作流程；优化移动端/网页端 Claude Code 使用体验 |
| 2026-01-26 | 1.1.0 | 添加 Coding Standards & Best Practices 章节；新增 SheetJS 技术栈规范 |
| 2026-01-12 | 1.0.0 | Initial CLAUDE.md creation |

---

**End of CLAUDE.md**

For questions or updates to this guide, please commit changes to this file following the git workflow above.
