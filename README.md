# LifeMatrix - 无限游戏

> 将人生视为一场无限游戏，让每一次微小的进化都可见。

## 项目简介

LifeMatrix 是一款基于"无限游戏"理念的个人成长追踪应用。采用 RPG 游戏化的数值反馈系统，通过极大化的雷达图直观展示用户在身心健康、事业、财务等维度的进化轨迹。

**🌐 在线体验**: [lifematrix.vercel.app](https://lifematrix.vercel.app)

## 核心功能

- 🎯 **多维度雷达图** - 直观展示各领域发展状态
- 📈 **经验值系统** - 每次记录获得 +1 XP
- ⚖️ **平衡度指标** - 基于标准差算法评估发展均衡性
- 📅 **时光热力图** - 可视化你的努力密度
- ☁️ **云同步** - Firebase 云存储，多设备同步
- 💾 **数据私有** - LocalStorage 存储，完全离线可用
- 📤 **备份导出** - 支持 JSON 和 CSV 格式

## 快速开始

1. 访问 [lifematrix.vercel.app](https://lifematrix.vercel.app)
2. 使用 Google 或邮箱注册/登录
3. 开始记录你的人生进化之旅

## 技术栈

- React 18 (Browser JSX)
- Tailwind CSS
- Firebase (Auth + Firestore)
- LocalStorage

## 文件结构

```
Life-Matrix/
├── index.html      # 主应用
├── manifest.json   # PWA 配置
├── sw.js           # Service Worker
├── icon-192.png    # 应用图标
└── icon-512.png    # 应用图标
```

## 许可

Copyright (c) 2026 Fuzzy-and-Fluffy

All rights reserved.

Permission is granted to use, copy, and modify this software for personal and non-commercial purposes only.

Commercial use, including but not limited to use in commercial products, services, SaaS, or internal business operations, requires a separate written license.
