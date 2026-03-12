# 🔒 安全配置与成本优化指南

## ⚠️ 安全注意事项

### 1. API Key 安全存储

#### ❌ 错误做法
```typescript
// 永远不要这样做！
const apiKey = 'apify_api_1234567890abcdef'
const supabaseUrl = 'https://xxx.supabase.co'
```

#### ✅ 正确做法
```typescript
// 使用环境变量
const apiKey = process.env.APIFY_API_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
```

### 2. .env.local 配置

创建 `.env.local` 文件（已在 .gitignore 中）：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Apify API 配置
APIFY_API_KEY=apify_api_xxxxxxxxxxxxx
APIFY_ACTOR_ID=your-actor-id

# 飞书 Webhook 配置
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx
```

### 3. 环境变量验证

**.gitignore** 已包含：
```
.env*.local
.env
```

✅ 确认这些文件不会被提交到 Git

### 4. 服务端 vs 客户端

| 变量 | 可见性 | 用途 |
|------|--------|------|
| `NEXT_PUBLIC_*` | 客户端可见 | Supabase URL/Key (公开) |
| 无前缀 | 仅服务端 | Apify Key、飞书 Webhook (私密) |

---

## 💰 成本优化策略

### 场景分析
- **KOC 数量**: 10 个
- **平台**: 小红书、抖音 (抓取成本较高)
- **Apify 定价**: 按运行时间和数据量收费

### 推荐配置

#### 1. 抓取频率

**建议**: 每 24 小时执行一次

**原因**:
- ✅ KOC 数量少 (10 个)
- ✅ 内容发布频率通常不高
- ✅ 大幅降低 API 调用成本
- ✅ 避免频繁抓取导致封禁

#### 2. 批次处理

**策略**: 每次最多抓取 20 条内容/KOC

```typescript
// lib/crawler.ts
const actorInput = {
  profileUrl: task.platformUrl,
  maxItems: 20,  // 限制数量
  platform: task.platform
}
```

#### 3. 增量抓取

**策略**: 只抓取最新内容

```typescript
// 只抓取最近 7 天的内容
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

// 在匹配时过滤旧内容
if (new Date(content.publishTime) < sevenDaysAgo) {
  continue
}
```

---

## ⏰ 定时任务配置

### 方案 1: Vercel Cron Jobs (推荐)

#### 创建 `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/monitor",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**说明**:
- `0 2 * * *` = 每天凌晨 2 点执行
- 完全免费
- 自动重试

#### Cron 表达式

| 表达式 | 含义 |
|--------|------|
| `0 2 * * *` | 每天 2:00 AM |
| `0 */12 * * *` | 每 12 小时 |
| `0 0 * * 0` | 每周日 0:00 |
| `0 2 1 * *` | 每月 1 日 2:00 |

### 方案 2: GitHub Actions

#### 创建 `.github/workflows/monitor.yml`

```yaml
name: 内容监测

on:
  schedule:
    - cron: '0 2 * * *'  # 每天 2:00 AM UTC
  workflow_dispatch:      # 允许手动触发

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: 触发监测
        run: |
          curl -X POST https://your-domain.vercel.app/api/monitor
```

### 方案 3: 第三方 Cron 服务

**免费服务**:
- [cron-job.org](https://cron-job.org) - 每 1 分钟
- [EasyCron](https://www.easycron.com) - 每 1 小时 (免费版)
- [UptimeRobot](https://uptimerobot.com) - 每 5 分钟监控

**配置**:
1. 注册账号
2. 添加任务: `POST https://your-domain.vercel.app/api/monitor`
3. 设置时间: 每天一次

---

## 📊 成本估算

### Apify 定价

| 方案 | 价格 | 包含 |
|------|------|------|
| Free | $0 | $5 免费额度/月 |
| Starter | $49/月 | $49 额度 |
| Team | $499/月 | $499 额度 |

### 单次抓取成本估算

**假设**:
- 10 个 KOC
- 每个抓取 20 条内容
- 每次运行时间: 2 分钟

**月度成本**:
```
单次成本: ~$0.50
每天一次: $0.50 × 30 = $15/月
```

✅ 在 Free Plan 的 $5 额度内（如果优化得当）

### 优化建议

1. **使用 Mock 模式测试** ✅ 已实现
2. **限制抓取数量** (maxItems: 20)
3. **增量抓取** (只抓最近 7 天)
4. **每天一次** (避免重复抓取)
5. **错误重试限制** (最多 3 次)

---

## 🛡️ 安全最佳实践

### 1. 检查清单

- [ ] `.env.local` 已创建
- [ ] `.env.local` 在 `.gitignore` 中
- [ ] 代码中无硬编码 API Key
- [ ] Supabase RLS 策略已启用
- [ ] 飞书 Webhook 已配置签名验证（可选）

### 2. 验证环境变量

```typescript
// lib/config.ts
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`缺少环境变量: ${missing.join(', ')}`)
  }
}
```

### 3. 生产环境配置

**Vercel**:
1. 进入项目 Settings → Environment Variables
2. 添加所有环境变量
3. 分别配置 Production / Preview / Development

**重要**: 永远不要在前端代码中暴露私密 Key

---

## 📝 配置步骤

### Step 1: 配置环境变量

```bash
# 复制示例文件
cp .env.local.example .env.local

# 编辑并填入真实的值
nano .env.local
```

### Step 2: 验证配置

```bash
# 启动开发服务器
npm run dev

# 访问监测页面
# http://localhost:3000/admin/monitor

# 查看配置状态
# ✓ Apify API Key: 已配置 / ⚠ 未配置
# ✓ 飞书 Webhook: 已配置 / ⚠ 未配置
```

### Step 3: 配置定时任务

**Vercel**:
```bash
# 创建 vercel.json
cat > vercel.json << 'EOF'
{
  "crons": [
    {
      "path": "/api/monitor",
      "schedule": "0 2 * * *"
    }
  ]
}
EOF

# 部署
vercel --prod
```

---

## 🚨 安全警告

### ❌ 绝对不要做

1. 在代码中硬编码 API Key
2. 将 `.env.local` 提交到 Git
3. 在前端暴露私密 Key
4. 共享 API Key 截图/日志
5. 将 Key 写在注释中

### ✅ 应该做

1. 使用环境变量
2. 定期轮换 API Key
3. 使用最小权限原则
4. 监控 API 使用量
5. 配置告警阈值

---

## 💡 监控与告警

### Apify 使用监控

```typescript
// 检查 Apify 额度
async function checkApifyUsage() {
  const response = await fetch('https://api.apify.com/v2/account/usage', {
    headers: {
      'Authorization': `Bearer ${process.env.APIFY_API_KEY}`
    }
  })

  const data = await response.json()

  if (data.monthlyUsage > 80) {  // 超过 80% 告警
    // 发送告警
    await sendFeishuText('⚠️ Apify 额度即将用完!')
  }
}
```

### Supabase 监控

在 Supabase Dashboard 查看:
- Database Usage
- API Requests
- Storage Usage

---

## 📖 相关文档

- Apify 文档: https://docs.apify.com/api/v2
- Vercel Cron: https://vercel.com/docs/cron-jobs
- Next.js 环境变量: https://nextjs.org/docs/basic-features/environment-variables

---

## ✅ 总结

1. ✅ **安全**: 所有 Key 使用环境变量
2. ✅ **成本**: 每天一次抓取，月成本 < $5
3. ✅ **自动化**: Vercel Cron 自动执行
4. ✅ **监控**: 配置状态实时显示

**建议配置**: 每天凌晨 2 点执行一次自动监测 ⭐
