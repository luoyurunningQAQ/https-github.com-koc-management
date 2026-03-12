# 管理后台功能说明

## 功能概述

管理后台 `/admin`，包含车型管理、申请审核和手动内容关联功能。

## 已实现的功能

### 1. 后台首页 `/admin`

**文件**: `app/admin/page.tsx`

**功能**:
- 数据统计卡片 (总申请数、待审核、在用车、车型数量)
- 功能入口卡片 (车型管理、申请审核)

---

### 2. 车型管理 `/admin/cars`

**文件**:
- `app/admin/cars/page.tsx` (服务端)
- `app/admin/cars/CarList.tsx` (客户端)

**功能**:
- ✅ 查看所有车型列表 (表格形式)
- ✅ 添加新车型 (名称、库存、图片链接)
- ✅ 编辑车型信息 (行内编辑)
- ✅ 显示车型图片
- ✅ 显示库存状态

**操作流程**:
1. 点击"添加车型"按钮
2. 填写车型名称 (必填)、库存数量、图片链接
3. 点击"确认添加"
4. 或点击表格中的"编辑"按钮修改现有车型

---

### 3. 申请审核 `/admin/applications`

**文件**:
- `app/admin/applications/page.tsx` (服务端)
- `app/admin/applications/ApplicationList.tsx` (客户端)

**功能**:
- ✅ 显示所有申请列表
- ✅ 状态过滤器 (全部、待审核、已通过、在用车)
- ✅ 审核操作:
  - **待审核** → 点击"通过" → 状态变为 `approved`
  - **已通过** → 点击"发车" → 状态变为 `driving`
  - **在用车** → 点击"管理内容" → 跳转到详情页
- ✅ 显示申请人、车型、日期、关键词

**状态流转**:
```
pending (待审核)
    ↓ [通过]
approved (已通过)
    ↓ [发车]
driving (在用车)
    ↓
finished (已完成)
```

---

### 4. 申请详情 `/admin/applications/[id]`

**文件**:
- `app/admin/applications/[id]/page.tsx` (服务端)
- `app/admin/applications/[id]/ContentManager.tsx` (客户端)

**左侧：申请信息**
- 状态、申请人、手机号
- 车型 (带图片)
- 用车日期
- 平台主页链接
- 内容关键词
- 申请时间

**右侧：内容管理**

#### 手动关联内容 (仅在 `driving` 状态可用)

**功能**:
1. 输入框：粘贴小红书或抖音内容链接
2. 点击"关联"按钮
3. 系统调用 Mock API 获取内容数据
4. 自动存入 Contents 表

**Mock API 功能**:
- 自动识别平台 (小红书/抖音/微博)
- 模拟生成标题
- 模拟生成点赞数、收藏数
- 1秒延迟模拟网络请求

**内容列表**:
- 显示标题、链接、平台
- 显示点赞数、收藏数
- 显示状态标签 (自动抓取/手动添加)
- 显示添加时间

---

## API 端点

### 车型管理

#### POST `/api/cars`
添加车型
```json
{
  "name": "Model S 高性能版",
  "stock": 5,
  "image_url": "https://..."
}
```

#### PUT `/api/cars/[id]`
更新车型
```json
{
  "name": "Model S 高性能版",
  "stock": 3,
  "image_url": "https://..."
}
```

### 申请管理

#### PATCH `/api/applications/[id]`
更新申请状态
```json
{
  "status": "approved" // 或 "driving"
}
```

### 内容管理

#### POST `/api/contents`
添加内容 (调用 Mock API)
```json
{
  "app_id": "uuid",
  "link": "https://www.xiaohongshu.com/..."
}
```

**Mock API 返回**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "app_id": "uuid",
    "title": "试驾体验 | 这台车真的太适合城市通勤了！",
    "platform": "小红书",
    "link": "https://...",
    "likes": 3456,
    "collects": 1234,
    "status": "manual",
    "created_at": "2026-03-12T..."
  }
}
```

---

## 文件结构

```
app/
├── admin/
│   ├── page.tsx                           # 后台首页
│   ├── cars/
│   │   ├── page.tsx                       # 车型管理页
│   │   └── CarList.tsx                    # 车型列表组件
│   └── applications/
│       ├── page.tsx                       # 申请列表页
│       ├── ApplicationList.tsx            # 申请列表组件
│       └── [id]/
│           ├── page.tsx                   # 申请详情页
│           └── ContentManager.tsx         # 内容管理组件
└── api/
    ├── cars/
    │   ├── route.ts                       # POST 添加车型
    │   └── [id]/
    │       └── route.ts                   # PUT 更新车型
    ├── applications/
    │   └── [id]/
    │       └── route.ts                   # PATCH 更新状态
    └── contents/
        └── route.ts                       # POST 添加内容 (Mock API)
```

---

## 测试步骤

### 1. 访问后台首页
```
http://localhost:3000/admin
```
查看统计数据和功能入口

### 2. 测试车型管理
```
http://localhost:3000/admin/cars
```

**添加车型**:
1. 点击"添加车型"
2. 输入: 名称 "测试车型 A"、库存 3、图片链接 (可选)
3. 点击"确认添加"
4. 查看表格中是否出现新车型

**编辑车型**:
1. 点击某个车型的"编辑"
2. 修改名称或库存
3. 点击"保存"

### 3. 测试申请审核
```
http://localhost:3000/admin/applications
```

**前提**: 需要先在 `/apply` 提交几个测试申请

**审核流程**:
1. 查看"待审核"列表
2. 点击某个申请的"通过"按钮
3. 状态变为"已通过"
4. 点击"发车"按钮
5. 状态变为"在用车"

### 4. 测试内容关联
```
http://localhost:3000/admin/applications/{申请ID}
```

**前提**: 申请状态必须是 `driving`

**添加内容**:
1. 在输入框粘贴链接:
   ```
   https://www.xiaohongshu.com/explore/123456
   ```
2. 点击"关联"按钮
3. 等待 1 秒 (Mock API 模拟延迟)
4. 看到成功提示
5. 内容出现在列表中，显示:
   - 模拟的标题
   - 平台 (小红书)
   - 模拟的点赞数、收藏数
   - 状态标签 (手动添加)

**测试链接**:
- 小红书: `https://www.xiaohongshu.com/explore/test123`
- 抖音: `https://www.douyin.com/video/test456`
- 微博: `https://weibo.com/test789`

---

## UI 特色

### 1. 后台首页
- 4 个统计卡片 (蓝色、橙色、绿色、紫色)
- 2 个功能入口卡片 (渐变背景、悬停缩放)

### 2. 车型管理
- 表格式展示
- 行内编辑
- 车型图片预览
- 库存状态标签 (绿色/红色)

### 3. 申请审核
- 状态过滤器 (按钮式)
- 彩色状态标签
- 车型图片显示
- 操作按钮 (通过/发车/管理内容)

### 4. 内容管理
- 蓝色输入区域 (手动添加)
- 内容卡片列表
- 点赞/收藏数据展示
- 状态标签 (自动/手动)

---

## Mock API 详情

**位置**: `app/api/contents/route.ts`

**模拟功能**:
1. 平台识别 (根据 URL)
2. 随机生成标题 (8 个预设模板)
3. 随机生成点赞数 (500-10000)
4. 随机生成收藏数 (200-5000)
5. 1 秒延迟模拟网络请求

**支持的平台**:
- 小红书 (xiaohongshu.com)
- 抖音 (douyin.com)
- 微博 (weibo.com)

**标题模板**:
- "试驾体验 | 这台车真的太适合城市通勤了！"
- "周末自驾游 Vlog | 带你看看这台车的实力"
- "新能源汽车测评 | 续航表现超预期"
- "露营神器！这台车的空间利用率绝了"
- 等...

---

## 注意事项

1. **状态限制**: 只有 `driving` 状态的申请才能添加内容
2. **重复检测**: 相同链接不能重复添加
3. **URL 验证**: 必须是有效的 URL 格式
4. **Mock API**: 当前使用模拟数据，实际项目需替换为真实的抓取逻辑

---

## 下一步改进

1. 真实的内容抓取 API (替换 Mock)
2. 批量操作 (批量审核、批量发车)
3. 搜索功能 (按姓名、手机号搜索)
4. 导出功能 (导出申请列表、内容列表)
5. 数据统计图表
6. 删除功能 (删除车型、删除内容)

---

**管理后台功能已完成，可以开始测试！**
