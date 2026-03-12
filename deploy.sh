#!/bin/bash

# KOC 管理系统 - 快速部署脚本

echo "🚀 开始部署 KOC 管理系统到 Vercel..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: KOC管理系统"
    echo "✅ Git 仓库初始化完成"
fi

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm i -g vercel
fi

# 登录 Vercel
echo "🔐 登录 Vercel..."
vercel login

# 部署
echo "🚀 开始部署..."
vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "📍 访问地址:"
echo "   首页: https://your-domain.vercel.app"
echo "   KOC申请: https://your-domain.vercel.app/apply"
echo "   管理后台: https://your-domain.vercel.app/admin"
echo ""
echo "⚙️  下一步:"
echo "   1. 在 Vercel Dashboard 配置环境变量"
echo "   2. 重新部署使环境变量生效"
echo "   3. 测试所有功能"
echo ""
echo "📚 详细文档: DEPLOYMENT_GUIDE.md"
