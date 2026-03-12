# 🚀 立即部署指南

## ✅ 代码已准备完毕

所有代码已提交到Git，现在可以部署了！

---

## 方式1: GitHub + Vercel (推荐 - 最简单) ⭐

### 步骤1: 创建GitHub仓库 (1分钟)

1. 访问 https://github.com/new
2. 仓库名称: `koc-management`
3. **不要** 初始化README/License/gitignore
4. 点击 "Create repository"

### 步骤2: 推送代码 (1分钟)

```bash
cd /c/Users/yanrun818_128057/koc-management

# 添加远程仓库 (替换为你的GitHub用户名)
git remote add origin https://github.com/你的用户名/koc-management.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤3: Vercel导入 (2分钟)

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 选择 `koc-management` 仓库
5. 点击 "Import"
6. Framework Preset 自动识别为 "Next.js"
7. 点击 "Deploy"

### 步骤4: 配置环境变量 (1分钟)

部署完成后:

1. Vercel Dashboard → 你的项目 → Settings
2. 左侧菜单 → Environment Variables
3. 添加以下3个必需变量:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [你的Supabase URL]
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [你的Supabase Key]
Environments: ✅ Production ✅ Preview ✅ Development

Name: ADMIN_PASSWORD
Value: [设置你的管理员密码]
Environments: ✅ Production ✅ Preview ✅ Development
```

4. 点击 Save
5. 返回 Deployments
6. 点击最新部署的 "..." → "Redeploy"

---

## 方式2: 本地CLI部署 (需要浏览器登录)

### 步骤1: 登录Vercel

```bash
cd /c/Users/yanrun818_128057/koc-management

# 启动登录 (会在浏览器中打开)
vercel login
```

在浏览器中完成登录。

### 步骤2: 部署

```bash
# 生产环境部署
vercel --prod
```

按照提示操作:
- Set up and deploy? Yes
- Which scope? 选择你的账号
- Link to existing project? No
- What's your project's name? koc-management
- In which directory is your code located? ./
- Want to override the settings? No

### 步骤3: 配置环境变量

部署完成后，在Vercel Dashboard配置环境变量（同方式1的步骤4）

---

## ⚠️ 重要: Supabase配置

在部署前/后，确保Supabase已配置:

### 1. 创建Supabase项目
访问 https://supabase.com 创建项目

### 2. 运行数据库初始化
```sql
-- 在Supabase SQL Editor中运行 schema.sql 的全部内容
-- 这将创建3张表和4个示例车型
```

### 3. 获取凭证
Settings → API:
- Project URL (例如: https://xxx.supabase.co)
- anon/public key (例如: eyJhbGci...)

---

## 🎊 部署完成后

### 访问你的应用

Vercel会自动分配域名:
```
https://koc-management-xxx.vercel.app
```

### 三个关键入口

1. **首页**: https://your-domain.vercel.app
2. **KOC申请**: https://your-domain.vercel.app/apply
3. **管理后台**: https://your-domain.vercel.app/admin

### 立即测试

1. 访问 `/apply` 提交测试申请
2. 访问 `/admin` 登录管理后台（使用你设置的ADMIN_PASSWORD）
3. 审核申请、发车、关联内容

---

## 📋 快速检查清单

部署前确认:
- [ ] ✅ 代码已提交到Git (已完成)
- [ ] Supabase项目已创建
- [ ] schema.sql已在Supabase运行
- [ ] 已获取Supabase URL和Key
- [ ] 已设置管理员密码

---

## 🚨 遇到问题?

**环境变量未生效?**
→ 配置后需要重新部署 (Deployments → Redeploy)

**页面空白?**
→ 检查浏览器控制台，可能是环境变量未配置

**无法登录管理后台?**
→ 检查ADMIN_PASSWORD是否配置正确

**车型下拉框为空?**
→ 确认schema.sql已在Supabase完整执行

---

**现在开始部署吧！推荐使用方式1（GitHub + Vercel）** 🚀
