# LifeMatrix PWA 上线指南

## 部署选项

### 推荐方案: GitHub Pages (免费)

```bash
# 1. 提交代码
git add .
git commit -m "LifeMatrix v3.4 - PWA Ready"
git push origin main

# 2. GitHub 设置
# Settings → Pages → Source: Deploy from branch (main)
```

**访问地址**: `https://[用户名].github.io/Life-Matrix/`

---

### 备选方案

| 平台 | 费用 | 特点 |
|------|------|------|
| **Vercel** | 免费 | 自动 HTTPS，部署速度快 |
| **Netlify** | 免费 | 表单处理，函数支持 |
| **Cloudflare Pages** | 免费 | 全球 CDN，性能优 |

## 当前部署

**生产环境**: [lifematrix.vercel.app](https://lifematrix.vercel.app)

---

## 上线前检查清单

- [x] `manifest.json` 配置完整
- [x] `sw.js` Service Worker 正常
- [x] `icon-192.png` 和 `icon-512.png` 已准备
- [x] Firebase 域名白名单配置
- [x] HTTPS 启用

---

## Firebase 配置

**项目 ID**: `life-matrix-c6b45`

**授权域名**:
- `localhost`
- `life-matrix-c6b45.firebaseapp.com`
- `life-matrix-c6b45.web.app`
- `lifematrix.vercel.app` ✅

---

## 发布后验证

1. 手机浏览器打开网址
2. 点击"添加到主屏幕"
3. 验证离线功能
4. 测试云同步登录
