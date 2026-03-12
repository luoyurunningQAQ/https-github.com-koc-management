# ⚡ 快速开始指南

## 🎯 5分钟部署到Vercel

### 第一步: 准备Supabase (2分钟)

1. **创建Supabase项目**
   - 访问 https://supabase.com
   - 创建新项目

2. **运行数据库初始化**
   - 打开 SQL Editor
   - 复制 `schema.sql` 全部内容
   - 点击 Run
   - ✅ 自动创建3张表 + 4个示例车型

3. **获取API凭证**
   - Settings → API
   - 复制 Project URL 和 anon/public key

---

### 第二步: 部署到Vercel (3分钟)

#### 方式A: 通过GitHub (推荐)

```bash
# 1. 提交代码
git add .
git commit -m "feat: KOC管理系统"

# 2. 推送到GitHub
git remote add origin https://github.com/你的用户名/koc-management.git
git push -u origin main

# 3. Vercel导入
# 访问 vercel.com → Import Project → 选择仓库
```

#### 方式B: 使用Vercel CLI

```bash
# 安装CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

#### 方式C: 一键脚本

```bash
chmod +x deploy.sh
./deploy.sh
```

---

### 第三步: 配置环境变量 (1分钟)

在 Vercel Dashboard:

1. **Settings → Environment Variables**

2. **添加必需变量**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   ADMIN_PASSWORD = your-secure-password
   ```

3. **选择所有环境**: Production + Preview + Development

4. **保存并重新部署**:
   - Deployments → Redeploy

---

## ✅ 完成！访问你的应用

### 📍 三个关键地址

1. **首页导航**
   ```
   https://your-domain.vercel.app
   ```

2. **KOC申请入口** (公开)
   ```
   https://your-domain.vercel.app/apply
   ```
   - 分享给KOC使用
   - 无需登录

3. **管理后台** (需登录)
   ```
   https://your-domain.vercel.app/admin
   ```
   - 管理员使用
   - 密码: 你在Vercel配置的 ADMIN_PASSWORD

---

## 🧪 快速测试

### 1. 测试KOC申请
```
访问: /apply
操作: 填写表单并提交
验证: 看到申请编号
```

### 2. 测试管理后台
```
访问: /admin
操作: 输入密码登录
验证: 看到统计数据
```

### 3. 测试自动监测
```bash
curl -X POST https://your-domain.vercel.app/api/monitor
```

---

## 🎊 开始使用

### 管理员操作流程

1. **登录后台** → `/admin`
2. **查看申请** → 申请审核页
3. **通过申请** → 点击"通过"
4. **发车** → 点击"发车"
5. **手动关联内容** → 申请详情页粘贴链接
6. **等待自动监测** → 每天凌晨2点自动执行

### KOC操作流程

1. **访问申请页** → `/apply`
2. **填写表单** → 姓名、手机、车型、关键词
3. **提交申请** → 获得申请编号
4. **等待审核** → 管理员通过
5. **试驾发车** → 开始创作内容
6. **自动监测** → 系统自动匹配并推送

---

## 📦 可选配置

### Apify API (可选)
```bash
APIFY_API_KEY=apify_api_xxx
APIFY_ACTOR_ID=your-actor-id
```
未配置将使用Mock数据

### 飞书Webhook (可选)
```bash
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```
未配置将仅打印日志

---

## 🚨 常见问题

**Q: 管理后台无法登录?**
A: 检查Vercel的 ADMIN_PASSWORD 是否配置

**Q: 申请表单车型为空?**
A: 确认 schema.sql 已在Supabase完整执行

**Q: Cron任务不执行?**
A: 检查 Vercel Dashboard → Cron Jobs

---

## 📚 详细文档

- `DEPLOYMENT_GUIDE.md` - 完整部署指南
- `FINAL_DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `SECURITY_AND_COST.md` - 安全和成本优化
- `README.md` - 项目完整说明

---

**就这么简单！开始使用吧！** 🎉
