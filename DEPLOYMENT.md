# 部署指南 (Deployment Guide)

## 🚀 快速部署

### 1. 环境要求
- Node.js 18+ 
- npm 或 yarn
- Supabase 账户

### 2. 克隆项目
```bash
git clone <your-repo-url>
cd thai-learning-app
npm install
```

### 3. 环境配置

复制环境变量模板：
```bash
cp .env.local.example .env.local
```

在 `.env.local` 中配置以下变量：
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Audio Storage
NEXT_PUBLIC_AUDIO_BASE_URL=your_audio_storage_url
```

### 4. 数据库设置

#### 4.1 创建 Supabase 项目
1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取项目URL和API密钥

#### 4.2 运行数据库迁移
在 Supabase SQL 编辑器中依次运行：

1. **创建表结构**：
   ```sql
   -- 复制 supabase/schema.sql 的内容并执行
   ```

2. **插入示例数据**：
   ```sql
   -- 复制 supabase/seed.sql 的内容并执行
   ```

### 5. 本地开发
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 🌐 生产环境部署

### Vercel 部署 (推荐)

1. **连接 GitHub**
   - 将代码推送到 GitHub
   - 在 Vercel 中导入项目

2. **配置环境变量**
   在 Vercel 项目设置中添加所有环境变量

3. **部署**
   - Vercel 会自动部署
   - 每次推送到主分支都会触发重新部署

### 其他平台部署

#### Netlify
```bash
npm run build
npm run export
```
然后上传 `out` 文件夹到 Netlify

#### Railway
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

## 📁 音频文件管理

### 本地开发
1. 在 `public/audio/` 目录下创建以下结构：
```
public/audio/
├── consonants/
├── vowels/
├── tones/
├── vocabulary/
└── lessons/
```

2. 上传对应的音频文件

### 生产环境
建议使用 CDN 或对象存储：
- AWS S3 + CloudFront
- Cloudinary
- Supabase Storage

## 🔧 配置说明

### 数据库配置
- 使用 Supabase PostgreSQL
- 启用行级安全 (RLS)
- 自动备份已配置

### 认证配置
- Supabase Auth
- 支持邮箱/密码登录
- 可扩展社交登录

### 音频配置
- 支持 MP3, WAV, OGG 格式
- 建议使用 44.1kHz 采样率
- 文件大小建议 < 1MB

## 📊 监控和分析

### 性能监控
- 使用 Vercel Analytics
- 配置 Core Web Vitals 监控

### 错误追踪
- 集成 Sentry (可选)
- 配置错误报告

### 用户分析
- Google Analytics (可选)
- Supabase Analytics

## 🔒 安全配置

### 环境变量安全
- 永远不要提交 `.env.local` 到 Git
- 使用强密码和密钥
- 定期轮换 API 密钥

### 数据库安全
- RLS 策略已配置
- 定期备份数据
- 监控异常访问

## 🚨 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 Supabase URL 和密钥
   - 确认数据库表已创建

2. **音频播放失败**
   - 检查音频文件路径
   - 确认 CORS 配置

3. **构建失败**
   - 检查 TypeScript 错误
   - 确认所有依赖已安装

### 日志查看
```bash
# 开发环境
npm run dev

# 生产环境
# 查看 Vercel 或其他平台的日志
```

## 📞 支持

如有问题，请：
1. 检查本文档的故障排除部分
2. 查看项目 Issues
3. 创建新的 Issue 描述问题

## 🔄 更新部署

### 代码更新
```bash
git pull origin main
npm install  # 如果有新依赖
npm run build
```

### 数据库更新
- 在 Supabase 中运行新的迁移脚本
- 备份数据库后再执行更新

---

**祝您部署顺利！** 🎉
