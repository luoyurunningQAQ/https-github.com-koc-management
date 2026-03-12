# KOC 试驾车管理系统

基于 Next.js (App Router)、Tailwind CSS 和 Supabase 构建的试驾车内容管理工具。

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **语言**: TypeScript
- **包管理**: npm

## 项目结构

```
koc-management/
├── app/                    # Next.js App Router 页面
├── lib/                    # 工具库
│   └── supabase.ts        # Supabase 客户端配置
├── types/                  # TypeScript 类型定义
│   └── database.ts        # 数据库类型
├── .env.local             # 环境变量（需要配置）
└── ../schema.sql          # 数据库 Schema（在项目根目录外）
```

## 快速开始

### 1. 配置 Supabase

1. 前往 [Supabase](https://supabase.com) 创建新项目
2. 在 Supabase 项目的 SQL Editor 中运行 `schema.sql` 文件
3. 获取项目的 URL 和 anon key：
   - 进入项目设置 (Project Settings)
   - 点击 API 选项
   - 复制 Project URL 和 anon/public key

### 2. 配置环境变量

⚠️ **安全提醒**: 永远不要在代码中硬编码 API Key！

复制 `.env.local.example` 为 `.env.local` 并填入您的凭证：

```bash
# Supabase 配置 (必需)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Apify API 配置 (可选，未配置将使用 Mock 数据)
APIFY_API_KEY=apify_api_xxx
APIFY_ACTOR_ID=your-actor-id

# 飞书 Webhook 配置 (可选，未配置将仅打印日志)
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

✅ 确保 `.env.local` 在 `.gitignore` 中（已配置）

### 3. 安装依赖

```bash
npm install
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 数据库表结构

### Cars (车型表)
- `id`: UUID 主键
- `name`: 车型名称
- `stock`: 库存数量
- `image_url`: 车型图片 URL
- `created_at`, `updated_at`: 时间戳

### Applications (申请表)
- `id`: UUID 主键
- `name`: 申请人姓名
- `phone`: 手机号
- `car_id`: 关联车型 ID
- `platform_url`: 平台主页链接
- `keywords`: 关键词
- `start_date`, `end_date`: 试驾起止日期
- `status`: 状态 (pending/approved/driving/finished)
- `created_at`, `updated_at`: 时间戳

### Contents (内容表)
- `id`: UUID 主键
- `app_id`: 关联申请 ID
- `title`: 内容标题
- `platform`: 平台名称
- `link`: 内容链接
- `likes`: 点赞数
- `collects`: 收藏数
- `status`: 抓取方式 (auto/manual)
- `created_at`, `updated_at`: 时间戳

## 开发指南

### 使用 Supabase 客户端

```typescript
import { supabase } from '@/lib/supabase'

// 查询数据
const { data, error } = await supabase
  .from('cars')
  .select('*')

// 插入数据
const { data, error } = await supabase
  .from('applications')
  .insert({ name, phone, car_id, ... })

// 更新数据
const { data, error } = await supabase
  .from('applications')
  .update({ status: 'approved' })
  .eq('id', applicationId)
```

### 类型安全

项目已配置完整的 TypeScript 类型定义，位于 `types/database.ts`。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 运行生产服务器
- `npm run lint` - 运行 ESLint 检查

## 数据库特性

- ✅ UUID 主键
- ✅ 自动时间戳（created_at, updated_at）
- ✅ 外键约束
- ✅ 索引优化
- ✅ 行级安全策略 (RLS)
- ✅ 数据库视图（applications_with_cars, contents_with_applications）

## 后续开发

项目已完成基础架构搭建，接下来可以开发：

1. 车型管理页面
2. KOC 申请页面
3. 内容抓取功能
4. 数据统计仪表板
5. 管理员后台

## 注意事项

- 确保 `.env.local` 文件不要提交到版本控制
- 生产环境请配置更严格的 RLS 策略
- 建议为 Supabase 配置备份策略

## License

MIT
