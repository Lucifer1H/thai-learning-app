# 🇨🇳 国内部署指南

由于 Vercel 在国内访问存在问题，本指南提供了几个国内友好的部署方案。

## 🎯 推荐方案

### 方案一：Netlify（最简单）

**优势：**
- ✅ 国内访问相对稳定
- ✅ 完全免费
- ✅ 支持自动部署
- ✅ 配置简单

**部署步骤：**

1. **访问 Netlify**
   - 打开：https://netlify.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New site from Git"
   - 选择 GitHub
   - 选择 `thai-learning-app` 仓库

3. **配置构建设置**
   ```
   Build command: npm run build
   Publish directory: out
   ```

4. **添加环境变量**
   在 Site settings > Environment variables 中添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   NEXTAUTH_SECRET=your_secret_key
   ```

5. **部署**
   - 点击 "Deploy site"
   - 等待构建完成

### 方案二：腾讯云 CloudBase（国内最佳）

**优势：**
- ✅ 国内访问速度极快
- ✅ 有免费额度
- ✅ 中文支持
- ✅ 集成度高

**部署步骤：**

1. **注册腾讯云**
   - 访问：https://cloud.tencent.com
   - 开通 CloudBase 服务

2. **安装 CLI**
   ```bash
   npm install -g @cloudbase/cli
   cloudbase login
   ```

3. **初始化项目**
   ```bash
   cloudbase init
   # 选择 Web 应用
   # 选择 Next.js 模板
   ```

4. **配置 cloudbaserc.json**
   ```json
   {
     "envId": "your-env-id",
     "framework": {
       "name": "nextjs",
       "plugins": {
         "node": {
           "use": "@cloudbase/framework-plugin-node",
           "inputs": {
             "entry": "app.js",
             "path": "/server"
           }
         }
       }
     }
   }
   ```

5. **部署**
   ```bash
   cloudbase framework deploy
   ```

### 方案三：GitHub Pages（完全免费）

**优势：**
- ✅ 完全免费
- ✅ 国内访问稳定
- ✅ 自动部署

**限制：**
- ⚠️ 只支持静态站点
- ⚠️ 需要修改认证逻辑

**部署步骤：**

1. **创建 GitHub Actions**
   创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           env:
             NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
             NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
             
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

2. **配置 GitHub Secrets**
   在仓库设置中添加环境变量

3. **启用 GitHub Pages**
   - 仓库设置 > Pages
   - 选择 gh-pages 分支

## 🔧 项目修改说明

我已经为您修改了 `next.config.js`，启用了静态导出功能：

```javascript
output: 'export',
trailingSlash: true,
images: {
  unoptimized: true,
},
```

这些修改使项目可以：
- ✅ 生成静态文件
- ✅ 部署到任何静态托管平台
- ✅ 在国内稳定访问

## 🚀 推荐部署顺序

1. **首选：Netlify** - 最简单，国内访问相对稳定
2. **次选：腾讯云 CloudBase** - 国内访问最佳，但需要实名认证
3. **备选：GitHub Pages** - 完全免费，但功能有限

## 📝 注意事项

1. **Supabase 配置**
   - 记得在 Supabase 中添加新域名到允许列表
   - 更新 Site URL 和 Redirect URLs

2. **环境变量**
   - 在部署平台中正确配置环境变量
   - 不要在代码中暴露敏感信息

3. **域名绑定**
   - 可以绑定自定义域名提升访问体验
   - 建议使用国内 CDN 加速

您希望我帮您配置哪个部署方案？
