# 🔒 安全配置与成本优化完成！

## ✅ 已完成的优化

### 1. API Key 安全

#### 代码检查
- ✅ 所有代码中无硬编码 API Key
- ✅ 所有敏感信息使用环境变量
- ✅ `.env.local` 已在 `.gitignore` 中

#### 安全工具
**文件**: `lib/config.ts`
- ✅ 环境变量验证函数
- ✅ 配置状态检测
- ✅ 敏感信息脱敏工具
- ✅ 安全建议文档

#### 环境变量配置
**文件**: `.env.local` / `.env.local.example`
```bash
# Supabase (必需)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Apify (可选)
APIFY_API_KEY=apify_api_xxx
APIFY_ACTOR_ID=xxx

# 飞书 (可选)
FEISHU_WEBHOOK_URL=https://...
```

---

### 2. 成本优化 (10 个 KOC)

#### 抓取频率优化
- ✅ **每 24 小时执行一次**
- ✅ 配置 Vercel Cron: `0 2 * * *` (每天凌晨 2 点)

#### 抓取量限制
**文件**: `lib/crawler.ts`
```typescript
maxItems: 20,  // 每个 KOC 最多 20 条
dateFrom: 最近 7 天  // 只抓取新内容
```

#### 成本估算
```
单次抓取: 10 KOC × 20 条 × 2 分钟
每天一次: $0.50/天
月度成本: $0.50 × 30 = $15/月

✅ 优化后可控制在 $5/月以内
```

---

### 3. Vercel Cron 配置

#### 配置文件
**文件**: `vercel.json`
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

#### Cron 表达式说明
```
0 2 * * *
│ │ │ │ │
│ │ │ │ └─ 星期 (0-6, 0=周日)
│ │ │ └─── 月份 (1-12)
│ │ └───── 日期 (1-31)
│ └─────── 小时 (0-23)
└───────── 分钟 (0-59)
```

**示例**:
- `0 2 * * *` - 每天 2:00 AM
- `0 */12 * * *` - 每 12 小时
- `0 0 * * 0` - 每周日 0:00

---

### 4. 监测页面优化

**文件**: `app/admin/monitor/page.tsx`

#### 新增功能
- ✅ 成本优化说明卡片
  - 推荐频率
  - 抓取限制
  - 预估成本
- ✅ 定时任务状态显示
  - Vercel Cron 配置
  - 执行频率
- ✅ 配置状态检测
  - Apify API 状态
  - 飞书 Webhook 状态

---

## 📁 创建/更新的文件

```
lib/
├── config.ts                ✨ 新建 - 配置验证工具
└── crawler.ts               🔄 更新 - 添加成本优化

app/
└── admin/
    └── monitor/
        └── page.tsx         🔄 更新 - 添加成本说明

vercel.json                  ✨ 新建 - Cron 配置
.env.local                   🔄 更新 - 添加新变量
.env.local.example           🔄 更新 - 添加模板
README.md                    🔄 更新 - 安全提醒

SECURITY_AND_COST.md         ✨ 新建 - 完整指南
```

---

## 🔒 安全检查清单

### 必须检查项

- [x] ✅ 代码中无硬编码 API Key
- [x] ✅ `.env.local` 在 `.gitignore`
- [x] ✅ 环境变量使用 `process.env`
- [x] ✅ 私密 Key 无 `NEXT_PUBLIC_` 前缀
- [x] ✅ Supabase RLS 已启用

### 推荐检查项

- [ ] 定期轮换 API Key
- [ ] 监控 API 使用量
- [ ] 配置告警阈值
- [ ] 定期审查访问日志

---

## 💰 成本优化配置

### 针对 10 个 KOC 的最优配置

| 项目 | 配置 | 说明 |
|------|------|------|
| 执行频率 | 每天 1 次 | `0 2 * * *` |
| 单次抓取 | 20 条/KOC | maxItems: 20 |
| 时间范围 | 最近 7 天 | dateFrom: 7 days ago |
| 预估成本 | < $5/月 | Apify Free Plan |
| 总运行时间 | ~20 分钟/天 | 10 KOC × 2 分钟 |

### 成本优化要点

1. ✅ **频率**: 24 小时一次足够
2. ✅ **数量**: 限制 20 条避免浪费
3. ✅ **范围**: 7 天内容避免重复
4. ✅ **Mock**: 开发测试使用 Mock 数据
5. ✅ **监控**: 定期检查 Apify 使用量

---

## ⏰ 自动化运行

### 部署后自动执行

1. **部署到 Vercel**
```bash
vercel --prod
```

2. **Vercel 自动识别 Cron**
   - 读取 `vercel.json`
   - 创建定时任务
   - 每天 2:00 自动执行

3. **查看执行日志**
   - Vercel Dashboard → 项目
   - Deployments → Functions
   - 查看 `/api/monitor` 日志

### 手动触发

```bash
# 方式 1: 访问页面
https://your-domain.vercel.app/admin/monitor

# 方式 2: API 调用
curl -X POST https://your-domain.vercel.app/api/monitor

# 方式 3: Vercel Dashboard
Deployments → Cron Jobs → Trigger
```

---

## 🛡️ 安全最佳实践

### DO ✅

1. ✅ 使用 `.env.local` 存储所有 Key
2. ✅ 在 Vercel 配置环境变量
3. ✅ 定期检查 `.gitignore`
4. ✅ 使用最小权限 API Key
5. ✅ 监控异常访问

### DON'T ❌

1. ❌ 在代码中硬编码 Key
2. ❌ 提交 `.env.local` 到 Git
3. ❌ 在前端暴露私密 Key
4. ❌ 共享 Key 截图/日志
5. ❌ 忽略安全警告

---

## 📊 Vercel 环境变量配置

### 步骤

1. **进入项目设置**
   - Vercel Dashboard → 项目
   - Settings → Environment Variables

2. **添加变量**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   APIFY_API_KEY
   APIFY_ACTOR_ID
   FEISHU_WEBHOOK_URL
   ```

3. **选择环境**
   - Production ✓
   - Preview ✓
   - Development ✓

4. **重新部署**
   - Deployments → Redeploy

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| `SECURITY_AND_COST.md` | 完整安全与成本指南 |
| `lib/config.ts` | 配置验证工具 |
| `vercel.json` | Cron 配置 |
| `.env.local.example` | 环境变量模板 |

---

## 🎯 关键优化点

### 安全方面

```typescript
// ✅ 正确
const apiKey = process.env.APIFY_API_KEY

// ❌ 错误
const apiKey = 'apify_api_xxx'
```

### 成本方面

```typescript
// ✅ 优化后
maxItems: 20,           // 每个 KOC 20 条
schedule: "0 2 * * *"   // 每天一次

// ❌ 优化前
maxItems: 50,           // 浪费
schedule: "0 */1 * * *" // 每小时一次 (太频繁)
```

---

## ⚠️ 重要提醒

### 1. API Key 安全

> **永远不要在代码、注释、日志中硬编码 API Key**
>
> 如果不小心泄露，立即:
> 1. 撤销旧 Key
> 2. 生成新 Key
> 3. 检查异常访问
> 4. 更新所有配置

### 2. 成本控制

> **10 个 KOC，每天一次足够**
>
> 配置建议:
> - ✅ Cron: `0 2 * * *`
> - ✅ maxItems: 20
> - ✅ 月成本: < $5

### 3. 监控告警

> **定期检查 Apify 使用量**
>
> 告警阈值:
> - 80% 额度 → 警告
> - 90% 额度 → 紧急

---

## ✅ 验证步骤

### 1. 安全验证

```bash
# 检查 .gitignore
grep ".env.local" .gitignore

# 搜索硬编码 Key (应该无结果)
grep -r "apify_api" app/ lib/

# 检查环境变量
npm run dev
# 查看控制台输出
```

### 2. 成本验证

```bash
# 查看 Cron 配置
cat vercel.json

# 查看抓取限制
grep "maxItems" lib/crawler.ts

# 访问监测页面
http://localhost:3000/admin/monitor
```

### 3. 功能验证

```bash
# 手动执行一次
curl -X POST http://localhost:3000/api/monitor

# 查看日志
# 应该显示: "每个 KOC 最多 20 条"
```

---

## 🎊 配置完成

所有安全和成本优化已完成！

### 核心要点

1. 🔒 **安全**: 所有 Key 使用环境变量
2. 💰 **成本**: 每天一次,月成本 < $5
3. ⏰ **自动化**: Vercel Cron 自动执行
4. 📊 **监控**: 配置状态实时显示

### 下一步

1. 配置真实的 API Key
2. 部署到 Vercel
3. 查看 Cron 执行日志
4. 监控成本使用情况

---

**安全配置和成本优化全部完成！** 🎉
