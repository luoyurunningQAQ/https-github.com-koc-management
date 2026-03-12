# 🚀 最终部署前检查清单

## ✅ 代码完整性检查

### 核心功能文件
- ✅ `schema.sql` - 数据库结构 (包含4个示例车型)
- ✅ `middleware.ts` - 管理员认证中间件
- ✅ `app/page.tsx` - 首页导航
- ✅ `app/apply/page.tsx` - KOC申请入口
- ✅ `app/admin/page.tsx` - 管理后台首页
- ✅ `app/admin/login/page.tsx` - 管理员登录页
- ✅ `vercel.json` - Vercel配置(Cron + 路由)
- ✅ `deploy.sh` - 快速部署脚本

### API路由
- ✅ `/api/applications` - 申请提交
- ✅ `/api/applications/[id]` - 申请状态更新
- ✅ `/api/cars` - 车型管理
- ✅ `/api/contents` - 内容关联
- ✅ `/api/monitor` - 自动监测
- ✅ `/api/admin/login` - 管理员登录
- ✅ `/api/admin/logout` - 管理员登出

### 管理后台页面
- ✅ `/admin/cars` - 车型管理
- ✅ `/admin/applications` - 申请审核
- ✅ `/admin/applications/[id]` - 申请详情
- ✅ `/admin/monitor` - 内容监测

### 核心库文件
- ✅ `lib/supabase.ts` - Supabase客户端
- ✅ `lib/crawler.ts` - Apify爬虫 + Mock数据
- ✅ `lib/feishu.ts` - 飞书消息推送
- ✅ `lib/config.ts` - 环境变量验证

---

## 📋 环境变量准备

### 必需配置
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
ADMIN_PASSWORD=your-secure-password  # ⚠️ 请修改默认密码!
```

### 可选配置
```bash
APIFY_API_KEY=apify_api_xxx  # 未配置将使用Mock数据
APIFY_ACTOR_ID=your-actor-id
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

---

## 🔐 安全检查

- ✅ 无硬编码API密钥
- ✅ 环境变量已在 `.env.local.example` 中定义
- ✅ `.env.local` 已在 `.gitignore` 中
- ✅ 管理员密码保护已启用
- ✅ Cookie使用httpOnly标志
- ✅ Supabase RLS策略已配置

---

## 💰 成本优化确认

- ✅ Apify爬取限制: 20条/KOC
- ✅ 日期范围: 最近7天
- ✅ 执行频率: 每天1次 (凌晨2点)
- ✅ Mock数据降级可用
- ✅ 适用场景: 10个KOC

---

## 📊 数据库初始化

### Supabase准备
```sql
-- 在 Supabase SQL Editor 运行 schema.sql
-- 包含:
-- ✅ Cars 表 + 4个示例车型
-- ✅ Applications 表
-- ✅ Contents 表
-- ✅ 触发器和索引
-- ✅ RLS策略
```

### 验证数据
```sql
SELECT * FROM cars;
-- 应该看到4条记录:
-- - Model S 高性能版 (库存: 3)
-- - Model X 长续航版 (库存: 2)
-- - Model 3 标准版 (库存: 5)
-- - Model Y 性能版 (库存: 4)
```

---

## 🚀 部署步骤 (三选一)

### 方式1: GitHub + Vercel (推荐) ⭐

```bash
# 1. 提交代码到Git
git add .
git commit -m "feat: 完成KOC管理系统开发"

# 2. 推送到GitHub (如果还没有)
git remote add origin https://github.com/你的用户名/koc-management.git
git push -u origin main

# 3. 在Vercel导入项目
# 访问 vercel.com → Import Project → 选择GitHub仓库

# 4. 在Vercel配置环境变量
# Settings → Environment Variables → 添加所有必需变量

# 5. 重新部署
# Deployments → Redeploy
```

### 方式2: Vercel CLI

```bash
# 1. 安装CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd /c/Users/yanrun818_128057/koc-management
vercel --prod

# 4. 配置环境变量后重新部署
vercel --prod --force
```

### 方式3: 使用部署脚本

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🧪 部署后测试清单

### 1. 基础访问测试
- [ ] 访问首页 `https://your-domain.vercel.app`
- [ ] 看到导航卡片 (KOC申请 + 管理后台)
- [ ] 点击链接正常跳转

### 2. KOC申请表单测试
- [ ] 访问 `/apply`
- [ ] 看到车型下拉框有数据 (4个车型)
- [ ] 填写完整表单
- [ ] 提交成功并显示申请编号
- [ ] Supabase Applications表有新记录

### 3. 管理后台登录测试
- [ ] 访问 `/admin`
- [ ] 自动跳转到 `/admin/login`
- [ ] 输入错误密码 → 显示错误
- [ ] 输入正确密码 → 登录成功
- [ ] Cookie保存登录状态

### 4. 管理功能测试
- [ ] 查看统计数据
- [ ] 车型管理 - 添加/修改车型
- [ ] 申请审核 - 通过申请
- [ ] 申请详情 - 发车状态
- [ ] 手动关联内容 - 粘贴链接
- [ ] 查看关联内容列表

### 5. 自动监测测试
```bash
# 手动触发监测
curl -X POST https://your-domain.vercel.app/api/monitor

# 检查响应
# 查看Vercel函数日志
# 检查飞书是否收到消息(如配置)
```

### 6. 权限测试
- [ ] 未登录访问 `/admin` → 跳转登录页
- [ ] 未登录访问 `/admin/cars` → 跳转登录页
- [ ] 登录后访问所有管理页面正常
- [ ] 点击退出登录 → 清除Cookie
- [ ] 退出后访问 `/admin` → 重新跳转登录页

---

## 📍 访问地址汇总

部署完成后获得以下地址:

### 🌐 首页导航
```
https://your-domain.vercel.app
```

### 📝 KOC申请入口 (公开)
```
https://your-domain.vercel.app/apply
```
- 无需登录
- 任何人可访问
- 提交试驾申请

### 🔐 管理后台入口 (需登录)
```
https://your-domain.vercel.app/admin
```
- 需要密码登录
- 管理员使用
- 审核申请、监测内容

---

## ⚙️ Vercel配置详细步骤

### 1. 环境变量配置

在 Vercel Dashboard 中:

1. 选择项目 → Settings → Environment Variables
2. 逐个添加以下变量:

```
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

3. 可选变量同样配置

### 2. Cron任务验证

1. Vercel Dashboard → Settings → Cron Jobs
2. 应该看到: `/api/monitor` - 每天凌晨2点执行
3. 可以手动触发测试

### 3. 函数日志查看

1. Vercel Dashboard → Deployments
2. 选择最新部署
3. 点击 Functions
4. 查看各API的执行日志

---

## 🎯 功能完整性对照

### 用户端功能 ✅
- [x] 首页导航
- [x] 在线申请表单
- [x] 表单验证 (必填项、手机号、日期)
- [x] 提交成功反馈
- [x] 申请编号显示

### 管理端功能 ✅
- [x] 管理员登录/登出
- [x] 车型管理 (增删改查)
- [x] 申请列表 (状态筛选)
- [x] 申请详情 (完整信息)
- [x] 审核操作 (通过/发车)
- [x] 手动关联内容
- [x] 内容列表展示
- [x] 统计数据面板

### 自动化功能 ✅
- [x] Apify API集成
- [x] Mock数据降级
- [x] 关键词匹配逻辑
- [x] 自动内容监测
- [x] 飞书消息推送
- [x] Vercel Cron定时任务
- [x] 成本优化配置

### 安全功能 ✅
- [x] 环境变量管理
- [x] Cookie认证
- [x] 路由中间件保护
- [x] RLS策略
- [x] 无硬编码密钥

---

## 🚨 常见问题排查

### Q1: 页面空白/白屏
**检查项:**
- 浏览器控制台是否有错误
- Vercel环境变量是否配置完整
- 重新部署是否成功

### Q2: 管理后台无法登录
**检查项:**
- `ADMIN_PASSWORD` 是否在Vercel配置
- Cookie是否被浏览器拦截
- 尝试无痕模式测试

### Q3: 申请表单提交失败
**检查项:**
- Supabase URL和Key是否正确
- Supabase RLS策略是否启用
- 网络请求是否被拦截

### Q4: 车型下拉框为空
**检查项:**
- Cars表是否有数据
- schema.sql是否完整执行
- API `/api/cars` 是否正常

### Q5: Cron任务不执行
**检查项:**
- vercel.json是否正确
- Vercel Dashboard → Cron Jobs是否显示
- 时区是否正确 (UTC 2:00 = 北京时间 10:00)

### Q6: 飞书通知未收到
**检查项:**
- `FEISHU_WEBHOOK_URL` 是否配置
- URL是否有效
- 手动调用 `/api/monitor` 测试
- 查看Vercel函数日志

---

## 📚 相关文档索引

| 文档名称 | 用途 |
|---------|------|
| `DEPLOYMENT_GUIDE.md` | 完整部署指南 |
| `DEPLOYMENT_COMPLETE.md` | 部署配置总结 |
| `SECURITY_AND_COST.md` | 安全和成本优化 |
| `MONITOR_FEATURE_README.md` | 监测功能说明 |
| `README.md` | 项目总体说明 |
| `.env.local.example` | 环境变量模板 |

---

## ✅ 最终确认清单

在部署前，请确认:

- [ ] 所有代码已提交到Git
- [ ] Supabase数据库已初始化
- [ ] Cars表有至少3个车型数据
- [ ] 已准备好所有必需的环境变量
- [ ] 已修改默认管理员密码
- [ ] 已阅读部署指南
- [ ] 准备好GitHub账号(如使用方式1)
- [ ] 准备好Vercel账号

---

## 🎊 部署完成后

1. **记录访问地址**
   - 首页
   - KOC申请入口
   - 管理后台入口

2. **测试所有功能**
   - 按照测试清单逐项验证

3. **配置Cron任务**
   - 确认自动监测正常

4. **准备使用**
   - 分享KOC申请链接
   - 开始使用管理后台

---

**准备就绪，开始部署！** 🚀

如有问题，参考文档或检查Vercel日志。
