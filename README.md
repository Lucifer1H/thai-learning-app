# 泰语学习平台 (Thai Language Learning Platform)

专为中文母语者设计的综合泰语学习网站，提供从基础字母到日常对话的完整学习体验。

A comprehensive Thai language learning website specifically designed for native Chinese speakers, offering complete learning experience from basic alphabet to daily conversations.

## 功能特点 (Features)

- 🔤 **泰语字母学习** - 44个辅音和32个元音的交互式学习
- 🎵 **发音练习** - 标准泰语发音和5个声调系统
- ✍️ **书写练习** - 交互式泰文字母书写练习
- 📚 **词汇管理** - 分类词汇学习和间隔重复系统
- 📖 **语法课程** - 中文解释的泰语语法规则
- 📊 **进度追踪** - 详细的学习进度和成就系统
- 🎯 **个性化学习** - 适应性学习路径
- 📱 **移动优化** - 完全响应式设计

## 技术栈 (Tech Stack)

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **UI Components**: Lucide React, Framer Motion
- **Notifications**: React Hot Toast

## 快速开始 (Quick Start)

### 1. 克隆项目 (Clone the repository)

```bash
git clone https://github.com/Lucifer1H/thai-learning-app.git
cd thai-learning-app
```

### 2. 安装依赖 (Install dependencies)

```bash
npm install
```

### 3. 环境配置 (Environment Setup)

复制环境变量模板文件：
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

### 4. 数据库设置 (Database Setup)

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 Supabase SQL 编辑器中运行 `supabase/schema.sql`
3. 运行 `supabase/seed.sql` 插入示例数据

### 5. 启动开发服务器 (Start development server)

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构 (Project Structure)

```
thai-learning-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # 认证页面
│   │   ├── dashboard/         # 用户仪表板
│   │   ├── lessons/           # 课程页面
│   │   └── vocabulary/        # 词汇页面
│   ├── components/            # 可复用组件
│   │   ├── ui/               # UI 基础组件
│   │   ├── lesson/           # 课程相关组件
│   │   └── vocabulary/       # 词汇相关组件
│   ├── lib/                  # 工具库和配置
│   │   ├── supabase.ts       # Supabase 客户端
│   │   ├── utils.ts          # 工具函数
│   │   └── types.ts          # TypeScript 类型定义
│   └── hooks/                # 自定义 React Hooks
├── supabase/
│   ├── schema.sql            # 数据库架构
│   └── seed.sql              # 示例数据
├── public/
│   ├── audio/                # 音频文件
│   └── images/               # 图片资源
└── docs/                     # 项目文档
```

## 数据库架构 (Database Schema)

主要数据表：
- `users` - 用户信息和学习偏好
- `lessons` - 课程内容和元数据
- `vocabulary` - 词汇数据和翻译
- `user_lesson_progress` - 用户课程进度
- `user_vocabulary_progress` - 用户词汇掌握情况
- `study_sessions` - 学习会话记录
- `achievements` - 成就系统
- `audio_files` - 音频文件元数据

## 开发指南 (Development Guide)

### 添加新课程 (Adding New Lessons)

1. 在数据库中插入课程数据
2. 创建对应的课程组件
3. 更新路由配置

### 添加新词汇 (Adding New Vocabulary)

1. 在 `vocabulary` 表中添加词汇数据
2. 上传对应的音频文件
3. 更新词汇分类

### 自定义主题 (Custom Theming)

在 `src/app/globals.css` 中修改 CSS 变量来自定义主题。

## 部署 (Deployment)

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 部署应用

### 其他平台

项目支持部署到任何支持 Next.js 的平台，如 Netlify、Railway 等。

## 贡献 (Contributing)

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证 (License)

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 支持 (Support)

如有问题或建议，请：
- 创建 GitHub Issue
- 发送邮件至 support@thai-learning.com
- 加入我们的社区讨论

---

**专为中文母语者设计的泰语学习体验** 🇹🇭 ❤️ 🇨🇳
