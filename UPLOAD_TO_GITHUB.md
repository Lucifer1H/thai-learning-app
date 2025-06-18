# 📤 上传到GitHub指南

## 🚀 快速上传步骤

### 1. 在GitHub上创建新仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `thai-learning-app`
   - **Description**: `专为中文母语者设计的泰语学习平台 - Thai Language Learning Platform for Chinese Speakers`
   - **Visibility**: Public (推荐) 或 Private
   - **不要**勾选 "Add a README file"、"Add .gitignore"、"Choose a license"
4. 点击 "Create repository"

### 2. 在本地初始化Git仓库
打开终端，进入项目目录：

```bash
cd thai-learning-app

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "🎉 初始提交: 泰语学习平台

- ✨ 完整的泰语字母学习模块
- 🎵 音频发音系统
- 📚 词汇管理和间隔重复
- 🔐 用户认证和进度追踪
- 📱 响应式设计
- 🧪 测试框架配置
- 📋 完整的项目文档"

# 添加远程仓库 (替换为您的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/thai-learning-app.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 3. 更新README中的链接
编辑 `README.md` 文件，将以下占位符替换为您的实际信息：
- `<repository-url>` → `https://github.com/YOUR_USERNAME/thai-learning-app.git`
- `YOUR_USERNAME` → 您的GitHub用户名

### 4. 配置GitHub Secrets (用于CI/CD)
如果您想启用自动部署，需要在GitHub仓库设置中添加以下Secrets：

1. 进入您的GitHub仓库
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 添加以下secrets：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VERCEL_TOKEN=your_vercel_token (如果使用Vercel部署)
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## 📝 后续步骤

### 1. 设置Supabase
1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 在SQL编辑器中运行 `supabase/schema.sql`
4. 运行 `supabase/seed.sql` 插入示例数据
5. 更新 `.env.local` 文件中的Supabase配置

### 2. 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 部署到生产环境
推荐使用 Vercel：
1. 访问 [Vercel](https://vercel.com)
2. 导入您的GitHub仓库
3. 配置环境变量
4. 部署

## 🔧 常用Git命令

### 日常开发流程
```bash
# 查看状态
git status

# 添加文件
git add .

# 提交更改
git commit -m "feat: 添加新功能"

# 推送到远程
git push

# 拉取最新更改
git pull
```

### 分支管理
```bash
# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature
```

### 提交信息规范
使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建工具

示例：
```bash
git commit -m "feat: 添加词汇搜索功能"
git commit -m "fix: 修复音频播放问题"
git commit -m "docs: 更新部署文档"
```

## 🎯 项目管理建议

### 1. 使用Issues追踪任务
- 创建Issues来追踪bug和功能请求
- 使用标签分类：`bug`, `enhancement`, `documentation`
- 分配给相应的开发者

### 2. 使用Projects管理进度
- 创建GitHub Project看板
- 设置 "To Do", "In Progress", "Done" 列
- 将Issues添加到Project中

### 3. 设置分支保护
- 在Settings → Branches中设置分支保护规则
- 要求PR审查
- 要求状态检查通过

## 🔒 安全注意事项

1. **永远不要提交敏感信息**：
   - API密钥
   - 密码
   - 私钥

2. **使用.gitignore**：
   - 已配置忽略 `.env*` 文件
   - 忽略 `node_modules/`
   - 忽略构建文件

3. **定期更新依赖**：
   ```bash
   npm audit
   npm update
   ```

## 📞 获取帮助

如果遇到问题：
1. 查看 [GitHub文档](https://docs.github.com)
2. 查看项目的 `CONTRIBUTING.md`
3. 在仓库中创建Issue

---

**祝您上传顺利！** 🚀
