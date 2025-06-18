@echo off
chcp 65001 >nul
echo.
echo 🚀 初始化泰语学习平台Git仓库...
echo 🚀 Initializing Thai Learning Platform Git repository...
echo.

REM 检查是否已经是Git仓库
if exist ".git" (
    echo ⚠️  已经是Git仓库，跳过初始化
    echo ⚠️  Already a Git repository, skipping initialization
) else (
    echo 📁 初始化Git仓库...
    git init
)

REM 添加所有文件
echo 📝 添加所有文件到Git...
git add .

REM 创建初始提交
echo 💾 创建初始提交...
git commit -m "🎉 初始提交: 泰语学习平台

✨ 功能特性:
- 🔤 完整的泰语字母学习模块 (辅音、元音、声调)
- 🎵 音频发音系统和录音对比功能
- 📚 词汇管理系统和间隔重复算法
- ✍️ 交互式书写练习和笔画顺序
- 🔐 用户认证和进度追踪系统
- 📱 响应式设计，支持移动端学习
- 🧪 完整的测试框架和CI/CD配置
- 📋 详细的项目文档和部署指南

🛠️ 技术栈:
- Next.js 15 + React 19 + TypeScript
- Supabase (数据库 + 认证)
- Tailwind CSS + Framer Motion
- Jest + Testing Library
- GitHub Actions

🎯 专为中文母语者设计的泰语学习体验"

echo.
echo ✅ Git仓库初始化完成！
echo.
echo 📋 下一步操作:
echo 1. 在GitHub上创建新仓库 'thai-learning-app'
echo 2. 运行以下命令连接远程仓库 (替换YOUR_USERNAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/thai-learning-app.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. 查看 UPLOAD_TO_GITHUB.md 获取详细说明
echo.
echo 🎉 准备就绪！祝您上传顺利！
echo.
pause
