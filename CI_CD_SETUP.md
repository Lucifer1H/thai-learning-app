# CI/CD 配置指南

## 🔧 当前状态

✅ **已修复的问题：**
- 更新了仓库URL配置
- 添加了Next.js配置文件
- 简化了GitHub Actions工作流
- 添加了容错处理

⚠️ **需要进一步配置的项目：**
- Supabase环境变量
- 部署secrets配置
- 测试框架完整设置

## 🚀 启用完整CI/CD的步骤

### 1. 配置GitHub Secrets

在GitHub仓库中添加以下Secrets：
1. 进入 `Settings` → `Secrets and variables` → `Actions`
2. 添加以下secrets：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VERCEL_TOKEN=your_vercel_token (可选，用于自动部署)
VERCEL_ORG_ID=your_vercel_org_id (可选)
VERCEL_PROJECT_ID=your_vercel_project_id (可选)
```

### 2. 启用部署作业

配置好secrets后，编辑 `.github/workflows/ci.yml`：
- 取消注释 `deploy-preview` 和 `deploy-production` 作业
- 移除注释标记 `#`

### 3. 本地开发设置

```bash
# 安装依赖
npm install

# 创建环境变量文件
cp .env.local.example .env.local

# 编辑 .env.local 添加您的配置
# 启动开发服务器
npm run dev
```

### 4. 测试配置

当前测试配置已就绪，但需要安装测试依赖：

```bash
# 安装测试相关依赖
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# 运行测试
npm run test
```

## 📋 CI/CD 工作流说明

### 当前启用的作业：

1. **lint-and-test** - 代码检查和测试
   - ESLint代码规范检查
   - TypeScript类型检查
   - Jest单元测试（如果配置）
   - Next.js构建测试

2. **security-scan** - 安全扫描
   - npm audit安全漏洞检查
   - 依赖包安全性验证

### 暂时禁用的作业：

3. **deploy-preview** - PR预览部署
4. **deploy-production** - 生产环境部署

## 🔍 故障排除

### 常见问题：

1. **构建失败 - 缺少环境变量**
   - 解决方案：配置GitHub Secrets或本地.env.local文件

2. **测试失败 - Jest未配置**
   - 解决方案：运行 `npm install` 安装测试依赖

3. **ESLint错误**
   - 解决方案：运行 `npm run lint:fix` 自动修复

### 检查CI状态：

```bash
# 查看最新提交状态
git log --oneline -5

# 检查远程状态
git status
```

## 📈 下一步建议

1. **立即可做：**
   - 设置Supabase项目
   - 配置本地环境变量
   - 运行本地开发服务器

2. **配置完成后：**
   - 启用自动部署
   - 设置分支保护规则
   - 配置代码审查要求

3. **长期优化：**
   - 添加更多测试用例
   - 配置性能监控
   - 设置错误追踪

## 🎯 快速验证

运行以下命令验证配置：

```bash
# 检查依赖
npm list

# 检查配置文件
ls -la .env* next.config.js tsconfig.json

# 测试构建
npm run build

# 运行代码检查
npm run lint
```

---

**配置完成后，您的CI/CD流水线将自动处理代码检查、测试和部署！** 🚀
