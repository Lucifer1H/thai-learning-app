# 🚀 Vercel 部署清单

## ✅ 部署前检查

- [x] 项目构建成功 (`npm run build`)
- [x] 所有代码已提交到 GitHub
- [x] Supabase 数据库已配置
- [x] 环境变量已准备

## 📋 Vercel 部署步骤

### 1. 访问 Vercel
- 打开：https://vercel.com
- 点击 "Sign up" 或 "Log in"
- 选择 "Continue with GitHub"

### 2. 导入项目
- 点击 "New Project"
- 找到您的仓库：`thai-learning-app`
- 点击 "Import"

### 3. 配置项目
- **Framework Preset**: Next.js (自动检测)
- **Root Directory**: `./` (默认)
- **Build Command**: `npm run build` (默认)
- **Output Directory**: `.next` (默认)
- **Install Command**: `npm install` (默认)

### 4. 环境变量配置
在 "Environment Variables" 部分添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://eqkzozmcgrlvcvfpyicy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3pvem1jZ3JsdmN2ZnB5aWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDYwOTMsImV4cCI6MjA2NTgyMjA5M30.GUNb-wRhKm6unJLS91TqiryzkYJiyiQJJcAjqx_-jJc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3pvem1jZ3JsdmN2ZnB5aWN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0NjA5MywiZXhwIjoyMDY1ODIyMDkzfQ.7JMu9Ihnl64dbT1t7ZcUyFcLYcJLwS-rRCAMiuC-j0w
NEXTAUTH_SECRET=your-super-secret-key-for-production-change-this
NODE_ENV=production
```

### 5. 部署
- 点击 "Deploy"
- 等待构建完成（通常 2-5 分钟）

## 🎯 部署后操作

### 1. 获取网站地址
部署成功后，您会得到类似这样的地址：
- `https://thai-learning-app-xxx.vercel.app`

### 2. 更新 Supabase 设置
在 Supabase 项目设置中：
- 添加 Vercel 域名到 "Site URL"
- 添加到 "Redirect URLs"

### 3. 测试功能
- [ ] 网站可以正常访问
- [ ] 用户注册/登录功能
- [ ] 数据库连接正常
- [ ] 音频播放功能
- [ ] 所有页面正常显示

## 🔧 常见问题解决

### 构建失败
- 检查 `package.json` 中的依赖
- 确保所有 TypeScript 错误已修复
- 检查环境变量是否正确

### 数据库连接失败
- 确认 Supabase 环境变量正确
- 检查 Supabase 项目是否激活
- 验证 API 密钥是否有效

### 音频不播放
- Web Speech API 在 HTTPS 环境下工作更好
- 检查浏览器兼容性
- 确认音频文件路径正确

## 📱 分享您的网站

部署成功后，您可以：
1. 分享 Vercel 提供的 URL
2. 绑定自定义域名（可选）
3. 设置自动部署（已默认开启）

## 🎉 恭喜！

您的泰语学习网站现在可以被全世界的人访问了！
