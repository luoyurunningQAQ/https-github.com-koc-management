# Supabase 配置指南

## 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 或 "New Project"
3. 选择组织（Organization）
4. 填写项目信息：
   - **Name**: koc-management（或您喜欢的名称）
   - **Database Password**: 设置一个强密码（请保存好）
   - **Region**: 选择离您最近的区域（如 Singapore、Tokyo 等）
5. 点击 "Create new project"
6. 等待项目创建完成（约 1-2 分钟）

## 步骤 2: 运行数据库 Schema

1. 在 Supabase 项目页面，点击左侧菜单的 **SQL Editor**
2. 点击 "New query" 创建新查询
3. 打开项目根目录外的 `schema.sql` 文件
4. 复制所有内容并粘贴到 SQL Editor 中
5. 点击右下角的 **RUN** 按钮执行 SQL
6. 等待执行完成，应该看到 "Success" 提示

### 验证表是否创建成功

在 SQL Editor 中运行以下查询：

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

您应该看到以下表：
- cars
- applications
- contents
- crawl_logs (如果有)

## 步骤 3: 获取 API 凭证

1. 点击左侧菜单的 **Project Settings**（齿轮图标）
2. 在左侧子菜单中点击 **API**
3. 找到以下两个值：

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### API Keys - anon/public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

**注意**:
- **anon key** 是公开密钥，可以在前端使用
- **service_role key** 是私密密钥，仅在服务端使用，不要暴露

## 步骤 4: 配置环境变量

1. 在项目根目录找到 `.env.local` 文件
2. 将获取的凭证填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. 保存文件

## 步骤 5: 测试连接

1. 启动开发服务器：
```bash
npm run dev
```

2. 在浏览器控制台测试 Supabase 连接：

```javascript
// 打开浏览器控制台（F12），运行：
const { data, error } = await fetch('/api/test-supabase')
console.log(data, error)
```

或者创建一个测试页面来验证连接。

## 可选配置

### 1. 配置存储桶（Storage Bucket）用于图片上传

1. 点击左侧菜单的 **Storage**
2. 点击 "Create a new bucket"
3. 命名为 `car-images`
4. 设置为 Public（公开访问）
5. 点击 "Create bucket"

### 2. 配置 RLS 策略

在 SQL Editor 中可以运行以下命令来查看当前的 RLS 策略：

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

如果需要更严格的安全策略，可以修改 `schema.sql` 中的 RLS 部分。

### 3. 查看示例数据

运行以下查询查看插入的示例车型：

```sql
SELECT * FROM cars;
```

### 4. 启用实时订阅（可选）

如果需要实时数据同步功能：

1. 点击左侧菜单的 **Database**
2. 点击 **Replication**
3. 选择要启用实时功能的表（cars, applications, contents）
4. 勾选 "Enable Realtime"

## 常见问题

### Q: 执行 schema.sql 时出错？
A: 确保您的 Supabase 项目已完全初始化，然后重试。如果问题持续，检查 SQL 语法是否正确。

### Q: 无法连接到 Supabase？
A: 检查 `.env.local` 中的凭证是否正确，确保没有多余的空格或引号。

### Q: RLS 策略导致无法访问数据？
A: 在开发阶段，可以临时禁用 RLS：
```sql
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE contents DISABLE ROW LEVEL SECURITY;
```

### Q: 如何重置数据库？
A: 在 SQL Editor 中运行：
```sql
DROP TABLE IF EXISTS contents CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
```
然后重新运行 `schema.sql`。

## 安全建议

1. ✅ 永远不要将 `.env.local` 提交到 Git
2. ✅ 生产环境使用更严格的 RLS 策略
3. ✅ 定期备份数据库
4. ✅ 使用环境变量管理敏感信息
5. ✅ 监控 API 使用情况（在 Supabase 仪表板）

## 下一步

配置完成后，您可以开始开发应用功能：

1. 创建车型管理页面
2. 创建 KOC 申请表单
3. 实现内容抓取功能
4. 构建数据统计仪表板

祝开发顺利！
