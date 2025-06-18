# 贡献指南 (Contributing Guide)

感谢您对泰语学习平台的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告问题 (Bug Reports)
如果您发现了问题，请：
1. 检查是否已有相关 Issue
2. 创建新 Issue，包含：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（浏览器、操作系统等）

### 功能建议 (Feature Requests)
我们欢迎新功能建议：
1. 创建 Issue 描述功能需求
2. 说明功能的用途和价值
3. 提供可能的实现思路

### 代码贡献 (Code Contributions)

#### 开发环境设置
```bash
# 1. Fork 项目
# 2. 克隆您的 fork
git clone https://github.com/YOUR_USERNAME/thai-learning-app.git
cd thai-learning-app

# 3. 安装依赖
npm install

# 4. 创建开发分支
git checkout -b feature/your-feature-name

# 5. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 添加您的配置

# 6. 启动开发服务器
npm run dev
```

#### 代码规范
- 使用 TypeScript
- 遵循 ESLint 规则
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名
- 提交前运行 `npm run lint`

#### 提交规范
使用语义化提交信息：
```
feat: 添加新功能
fix: 修复问题
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建工具或依赖更新
```

示例：
```bash
git commit -m "feat: 添加词汇搜索功能"
git commit -m "fix: 修复音频播放问题"
git commit -m "docs: 更新部署文档"
```

#### Pull Request 流程
1. 确保代码通过所有检查
2. 更新相关文档
3. 创建 Pull Request
4. 填写 PR 模板
5. 等待代码审查

## 📝 开发指南

### 项目结构
```
src/
├── app/                    # Next.js 页面
├── components/            # 可复用组件
│   ├── ui/               # 基础 UI 组件
│   ├── audio/            # 音频相关组件
│   ├── lesson/           # 课程组件
│   └── vocabulary/       # 词汇组件
├── lib/                  # 工具函数
└── hooks/                # 自定义 Hooks
```

### 组件开发规范

#### 1. 组件结构
```tsx
'use client'; // 如果是客户端组件

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // 定义 props 类型
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 组件逻辑
  
  return (
    <div className={cn('base-classes', className)}>
      {/* 组件内容 */}
    </div>
  );
}
```

#### 2. 样式规范
- 使用 Tailwind CSS
- 响应式设计优先
- 支持深色模式（未来）
- 中文字体使用 `chinese-text` 类
- 泰文字体使用 `thai-text` 类

#### 3. 国际化
- 界面文字使用中文
- 注释使用中文
- 变量名使用英文
- 函数名使用英文

### 数据库开发

#### 添加新表
1. 在 `supabase/schema.sql` 中添加表定义
2. 添加 RLS 策略
3. 更新 TypeScript 类型定义
4. 创建迁移脚本

#### 示例：
```sql
-- 创建新表
CREATE TABLE public.new_table (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- 添加策略
CREATE POLICY "Users can view own data" ON public.new_table
    FOR SELECT USING (auth.uid() = user_id);
```

### 音频处理

#### 音频文件规范
- 格式：MP3 (推荐) 或 WAV
- 采样率：44.1kHz
- 比特率：128kbps
- 时长：< 10秒（单词）, < 30秒（句子）

#### 音频组件使用
```tsx
import { AudioPlayer } from '@/components/audio/audio-player';

<AudioPlayer 
  src="/audio/word.mp3"
  variant="minimal"
  onPlay={() => console.log('播放开始')}
/>
```

## 🧪 测试

### 运行测试
```bash
npm run test          # 运行所有测试
npm run test:watch    # 监听模式
npm run test:coverage # 覆盖率报告
```

### 测试规范
- 为新功能编写测试
- 测试文件命名：`*.test.tsx`
- 使用 Jest + React Testing Library
- 测试用例使用中文描述

### 示例测试
```tsx
import { render, screen } from '@testing-library/react';
import { VocabularyCard } from './vocabulary-card';

describe('VocabularyCard', () => {
  it('应该显示泰语单词', () => {
    render(<VocabularyCard vocabulary={mockData} />);
    expect(screen.getByText('สวัสดี')).toBeInTheDocument();
  });
});
```

## 📚 文档贡献

### 文档类型
- README.md - 项目介绍
- DEPLOYMENT.md - 部署指南
- API 文档 - 接口说明
- 组件文档 - 组件使用说明

### 文档规范
- 使用中文编写
- 提供代码示例
- 包含截图（如适用）
- 保持更新

## 🎨 设计贡献

### UI/UX 改进
- 提交设计稿或原型
- 说明设计理念
- 考虑中文用户习惯
- 确保移动端友好

### 图标和插图
- 使用 SVG 格式
- 保持一致的设计风格
- 提供不同尺寸版本

## 🌍 内容贡献

### 课程内容
- 泰语语法解释
- 词汇翻译和例句
- 文化背景介绍
- 学习技巧分享

### 音频内容
- 标准泰语发音
- 清晰的录音质量
- 适当的语速
- 包含音调变化

## ❓ 获取帮助

### 开发问题
- 查看现有 Issues
- 在 Discussions 中提问
- 联系维护者

### 学习资源
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 📄 许可证

通过贡献代码，您同意您的贡献将在与项目相同的许可证下发布。

---

再次感谢您的贡献！🙏
