# 🚀 Vercel 部署完整指南

## 📋 部署前准备清单

### 1. 必需配置
- [x] Supabase 项目已创建
- [x] schema.sql 已在 Supabase 运行
- [x] Cars 表有示例数据

### 2. 可选配置
- [ ] Apify API Key (未配置将使用 Mock 数据)
- [ ] 飞书 Webhook URL (未配置将打印日志)
- [ ] 管理员密码 (默认 admin123)

---

## 🔧 步骤 1: 准备 Supabase

### 1.1 运行数据库 Schema

在 Supabase SQL Editor 运行 `schema.sql`:

```sql
-- 已包含在 schema.sql 中:
-- ✅ Cars 表 + 4个示例车型
-- ✅ Applications 表
-- ✅ Contents 表
-- ✅ 触发器和索引
-- ✅ RLS 策略
```

### 1.2 验证数据

```sql
-- 检查车型数据
SELECT * FROM cars;

-- 应该看到 4 个示例车型:
-- - Model S 高性能版
-- - Model X 长续航版
-- - Model 3 标准版
-- - Model Y 性能版
```

### 1.3 获取 API 凭证

1. Supabase Dashboard → Settings → API
2. 复制:
   - Project URL
   - anon/public key

---

## 🚀 步骤 2: 连接 Vercel

### 方式 1: 通过 Git (推荐)

#### 2.1 初始化 Git (如果还没有)

```bash
cd /c/Users/yanrun818_128057/koc-management

# 检查 Git 状态
git status

# 如果还没有 Git
git init
git add .
git commit -m "Initial commit: KOC管理系统"
```

#### 2.2 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库 (例如: `koc-management`)
3. **不要** 初始化 README/License/gitignore

#### 2.3 推送代码

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/koc-management.git

# 推送代码
git branch -M main
git push -u origin main
```

#### 2.4 连接 Vercel

1. 访问 https://vercel.com
2. 登录/注册
3. 点击 "Add New..." → "Project"
4. 选择 GitHub 仓库 `koc-management`
5. 点击 "Import"

### 方式 2: 通过 CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd /c/Users/yanrun818_128057/koc-management
vercel

# 生产部署
vercel --prod
```

---

## ⚙️ 步骤 3: 配置环境变量

### 3.1 在 Vercel Dashboard 配置

1. Vercel Dashboard → 项目 → Settings → Environment Variables

### 3.2 必需配置

```bash
# Supabase (必需)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# 管理员密码 (必需 - 修改默认密码)
ADMIN_PASSWORD=your-secure-password
```

**重要**: 每个变量都选择三个环境:
- ✅ Production
- ✅ Preview
- ✅ Development

### 3.3 可选配置

```bash
# Apify API (可选)
APIFY_API_KEY=apify_api_xxx
APIFY_ACTOR_ID=your-actor-id

# 飞书 Webhook (可选)
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

### 3.4 保存并重新部署

1. 点击 "Save"
2. Deployments → 选择最新部署
3. 点击 "..." → "Redeploy"

---

## 🔐 步骤 4: 管理后台安全

### 4.1 设置管理员密码

在 Vercel Environment Variables 中设置:

```bash
ADMIN_PASSWORD=your-very-secure-password-here
```

### 4.2 测试登录

1. 访问 `https://your-domain.vercel.app/admin`
2. 自动跳转到登录页
3. 输入密码登录
4. 成功后进入管理后台

### 4.3 修改密码 (可选)

```bash
# 在 Vercel Dashboard 更新
ADMIN_PASSWORD=new-secure-password

# 重新部署生效
```

---

## 📍 步骤 5: 获取访问地址

### 5.1 Vercel 自动生成的域名

部署完成后,Vercel 会自动分配域名:

```
https://koc-management-xxx.vercel.app
```

### 5.2 两个关键入口

✅ **KOC 申请入口**:
```
https://your-domain.vercel.app/apply
```

✅ **管理后台入口**:
```
https://your-domain.vercel.app/admin
```

### 5.3 自定义域名 (可选)

1. Vercel Dashboard → Settings → Domains
2. 添加自定义域名
3. 配置 DNS 记录

---

## ✅ 步骤 6: 验证部署

### 6.1 测试首页

```
访问: https://your-domain.vercel.app
应该看到: 首页导航,两个入口卡片
```

### 6.2 测试申请表单

```
访问: https://your-domain.vercel.app/apply
测试: 填写申请表单并提交
验证: Supabase Applications 表有数据
```

### 6.3 测试管理后台

```
访问: https://your-domain.vercel.app/admin
验证: 跳转到登录页
登录: 输入管理员密码
验证: 进入后台首页,看到统计数据
```

### 6.4 测试 Cron 任务

```bash
# 手动触发
curl -X POST https://your-domain.vercel.app/api/monitor

# 检查 Vercel Dashboard → Deployments → Functions
# 应该看到 /api/monitor 的执行日志
```

---

## 📊 环境变量完整清单

### 生产环境配置表

| 变量名 | 必需 | 示例值 | 说明 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://xxx.supabase.co` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | `eyJhbGci...` | Supabase anon key |
| `ADMIN_PASSWORD` | ✅ | `secure-pass-123` | 管理员密码 |
| `APIFY_API_KEY` | ❌ | `apify_api_xxx` | Apify API (可选) |
| `APIFY_ACTOR_ID` | ❌ | `xxx` | Apify Actor ID (可选) |
| `FEISHU_WEBHOOK_URL` | ❌ | `https://open.feishu...` | 飞书 Webhook (可选) |

---

## 🔄 步骤 7: 自动部署配置

### 7.1 Git 推送自动部署

```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push

# Vercel 自动检测并部署
```

### 7.2 查看部署状态

1. Vercel Dashboard → Deployments
2. 实时查看构建日志
3. 部署成功后自动发布

### 7.3 回滚 (如需要)

1. Deployments → 选择之前的版本
2. 点击 "Promote to Production"

---

## 🎯 数据初始化确认

### Cars 表数据 (已在 schema.sql 中)

```sql
SELECT * FROM cars;

-- 应该有 4 条记录:
id  | name                    | stock | image_url
----+-------------------------+-------+-----------
... | Model S 高性能版         | 3     | https://...
... | Model X 长续航版         | 2     | https://...
... | Model 3 标准版           | 5     | https://...
... | Model Y 性能版           | 4     | https://...
```

如果数据不存在,在 Supabase SQL Editor 运行:

```sql
INSERT INTO cars (name, stock, image_url) VALUES
    ('Model S 高性能版', 3, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'),
    ('Model X 长续航版', 2, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'),
    ('Model 3 标准版', 5, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'),
    ('Model Y 性能版', 4, 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800');
```

---

## 🎊 部署完成！

### 访问入口

#### 🌐 首页
```
https://your-domain.vercel.app
```

#### 📝 KOC 申请入口
```
https://your-domain.vercel.app/apply
```

#### 🔐 管理后台入口 (需登录)
```
https://your-domain.vercel.app/admin
```

### 默认登录信息

```
管理员密码: 在 Vercel 配置的 ADMIN_PASSWORD
默认值: admin123 (请务必修改!)
```

---

## 🚨 常见问题

### Q1: 部署后页面空白?
A: 检查浏览器控制台,可能是环境变量未配置

### Q2: 无法登录管理后台?
A: 检查 Vercel 的 ADMIN_PASSWORD 是否配置正确

### Q3: 申请表单提交失败?
A: 检查 Supabase 凭证和 RLS 策略

### Q4: Cron 任务不执行?
A: 检查 vercel.json 是否正确,或在 Vercel Dashboard 查看 Cron Jobs

### Q5: 图片不显示?
A: 检查图片 URL 是否可访问,或替换为其他图片

---

## 📞 技术支持

如遇问题:
1. 查看 Vercel 构建日志
2. 查看浏览器控制台
3. 查看 Supabase 日志
4. 检查环境变量配置

---

**部署完成！祝使用愉快！** 🎉
