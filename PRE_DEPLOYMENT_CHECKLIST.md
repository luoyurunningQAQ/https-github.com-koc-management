# 🎯 部署前最终确认

**请在部署前确认以下所有项目** ✅

---

## 1️⃣ Supabase配置 (必需)

### ✅ 数据库初始化
- [ ] 已创建Supabase项目
- [ ] 已在SQL Editor运行 `schema.sql`
- [ ] 已验证Cars表有4条数据: `SELECT * FROM cars;`
- [ ] 已复制Project URL
- [ ] 已复制anon/public key

**验证命令**:
```sql
-- 在Supabase SQL Editor运行
SELECT COUNT(*) FROM cars;
-- 应该返回: 4

SELECT * FROM cars;
-- 应该看到4个车型
```

---

## 2️⃣ Vercel部署 (必需)

### ✅ 代码准备
- [ ] 所有文件已在项目目录
- [ ] package.json依赖完整
- [ ] vercel.json配置正确
- [ ] middleware.ts存在

### ✅ 部署方式选择 (三选一)

#### 方式A: GitHub + Vercel (推荐) ⭐
```bash
# 1. 提交到Git
git add .
git commit -m "feat: 完成KOC管理系统开发"

# 2. 推送到GitHub
git remote add origin https://github.com/你的用户名/koc-management.git
git push -u origin main

# 3. Vercel导入项目
# vercel.com → Import Project → 选择仓库
```

#### 方式B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### 方式C: 一键脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 3️⃣ 环境变量配置 (必需)

### ✅ 在Vercel Dashboard配置

**路径**: Settings → Environment Variables

### 必需变量 (3个)
```bash
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxx.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGci...
Environments: ✅ Production ✅ Preview ✅ Development

Name: ADMIN_PASSWORD
Value: your-secure-password
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **重要**:
- 所有3个环境都要勾选
- ADMIN_PASSWORD请修改默认值 admin123
- 保存后必须重新部署

### 可选变量 (3个)
```bash
# Apify API (可选 - 未配置将使用Mock数据)
APIFY_API_KEY=apify_api_xxx
APIFY_ACTOR_ID=your-actor-id

# 飞书Webhook (可选 - 未配置仅打印日志)
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

---

## 4️⃣ 部署后验证 (必需)

### ✅ 基础功能测试

#### 测试1: 首页
```
访问: https://your-domain.vercel.app
预期: 看到导航页面,两个入口卡片
```

#### 测试2: KOC申请
```
访问: https://your-domain.vercel.app/apply
操作: 填写表单并提交
预期: 看到成功提示和申请编号
验证: Supabase Applications表有新记录
```

#### 测试3: 管理后台登录
```
访问: https://your-domain.vercel.app/admin
预期: 自动跳转到 /admin/login
操作: 输入密码(ADMIN_PASSWORD的值)
预期: 登录成功,进入后台首页
验证: 看到统计数据
```

#### 测试4: 车型管理
```
访问: https://your-domain.vercel.app/admin/cars
预期: 看到4个车型列表
操作: 点击修改图标,更改车型名称
预期: 保存成功
```

#### 测试5: 申请审核
```
访问: https://your-domain.vercel.app/admin/applications
预期: 看到刚才提交的申请
操作: 点击"通过"按钮
预期: 状态变为 approved
操作: 点击"发车"按钮
预期: 状态变为 driving
```

#### 测试6: 手动关联内容
```
访问: 申请详情页
操作: 粘贴内容链接,点击添加
预期:
- 看到Mock数据(标题、点赞数、收藏数)
- 内容已保存到Contents表
- 如配置了飞书,收到消息通知
```

#### 测试7: 自动监测
```bash
# 手动触发
curl -X POST https://your-domain.vercel.app/api/monitor

# 检查响应
# 预期: 返回监测结果

# 查看Vercel日志
# Deployments → Functions → /api/monitor
# 预期: 看到执行日志
```

#### 测试8: 定时任务
```
Vercel Dashboard → Settings → Cron Jobs
预期: 看到 /api/monitor 每天凌晨2点执行
```

---

## 5️⃣ 安全确认 (必需)

### ✅ 安全检查清单
- [ ] 已修改 ADMIN_PASSWORD (不是默认的 admin123)
- [ ] 环境变量都在Vercel配置,未硬编码
- [ ] .env.local 已在 .gitignore
- [ ] 测试未登录访问 /admin 会跳转登录页
- [ ] 测试错误密码无法登录
- [ ] 测试登录后可以正常访问所有功能
- [ ] 测试退出登录后无法访问 /admin

---

## 6️⃣ 成本确认 (可选)

### ✅ 使用场景确认
当前配置适用于:
- 👥 10个KOC
- 🔄 每天1次自动监测
- 📊 每次最多200条内容 (10×20)
- 💰 预估成本: $6-31/月

### ✅ 成本优化措施
- ✅ 限制每个KOC抓取20条 (不是50)
- ✅ 限制时间范围7天 (不是30天)
- ✅ 每天仅执行1次
- ✅ 可选Mock数据降级

---

## 7️⃣ 访问地址记录 (必需)

部署完成后,请记录以下地址:

```
首页:
https://________________.vercel.app

KOC申请入口 (分享给KOC):
https://________________.vercel.app/apply

管理后台入口:
https://________________.vercel.app/admin

管理员密码:
________________
```

---

## 8️⃣ 文档参考

遇到问题时查看:

| 问题类型 | 查看文档 |
|---------|---------|
| 快速开始 | `QUICK_START.md` |
| 详细部署步骤 | `DEPLOYMENT_GUIDE.md` |
| 完整检查清单 | `FINAL_DEPLOYMENT_CHECKLIST.md` |
| 安全和成本 | `SECURITY_AND_COST.md` |
| 监测功能 | `MONITOR_FEATURE_README.md` |
| 项目总览 | `README.md` |
| 部署状态 | `DEPLOYMENT_READY.md` |

---

## ✅ 最终确认

在点击"部署"之前,请确认:

- [ ] ✅ Supabase已初始化 (schema.sql已运行)
- [ ] ✅ Supabase有4个示例车型
- [ ] ✅ 已准备好Supabase URL和Key
- [ ] ✅ 已修改管理员密码 (不用默认值)
- [ ] ✅ 已选择部署方式 (GitHub/CLI/脚本)
- [ ] ✅ 准备好配置环境变量
- [ ] ✅ 已阅读部署文档

---

## 🚀 开始部署

**一切就绪!** 现在可以开始部署了!

### 推荐流程:

1. **初始化Supabase** (2分钟)
   - 运行 schema.sql
   - 获取凭证

2. **部署到Vercel** (3分钟)
   - 选择上述三种方式之一

3. **配置环境变量** (1分钟)
   - 添加3个必需变量
   - 重新部署

4. **测试所有功能** (5分钟)
   - 按照测试清单逐项验证

5. **记录访问地址** (1分钟)
   - 保存好所有URL和密码

**总计: 约12分钟** ⏱️

---

## 🎊 部署成功后

### 立即可用功能
- ✅ KOC可以提交试驾申请
- ✅ 管理员可以审核申请
- ✅ 管理员可以发车
- ✅ 管理员可以手动关联内容
- ✅ 系统每天自动监测内容
- ✅ 匹配成功自动推送飞书

### 分享给团队
```
KOC申请链接:
https://your-domain.vercel.app/apply

管理后台链接 (仅管理员):
https://your-domain.vercel.app/admin
密码: [你设置的ADMIN_PASSWORD]
```

---

**祝部署顺利!** 🎉

如有问题,查看文档或Vercel日志。

---

*最后检查时间: 2026-03-12*
