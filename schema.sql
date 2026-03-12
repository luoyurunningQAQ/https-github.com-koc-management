-- ============================================
-- 试驾车内容管理工具 - 数据库 Schema
-- ============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Cars 表 - 存储车型信息
-- ============================================
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为 cars 表创建索引
CREATE INDEX idx_cars_name ON cars(name);

-- ============================================
-- 2. Applications 表 - 存储 KOC 申请信息
-- ============================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    platform_url TEXT NOT NULL,
    keywords TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'driving', 'finished')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为 applications 表创建索引
CREATE INDEX idx_applications_car_id ON applications(car_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_phone ON applications(phone);
CREATE INDEX idx_applications_dates ON applications(start_date, end_date);

-- ============================================
-- 3. Contents 表 - 存储抓取到的内容
-- ============================================
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    link TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    collects INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'auto' CHECK (status IN ('auto', 'manual')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为 contents 表创建索引
CREATE INDEX idx_contents_app_id ON contents(app_id);
CREATE INDEX idx_contents_platform ON contents(platform);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_link ON contents(link);

-- ============================================
-- 4. 创建更新 updated_at 的触发器函数
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有表添加 updated_at 自动更新触发器
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
    BEFORE UPDATE ON contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 插入示例数据（可选）
-- ============================================

-- 插入示例车型数据
INSERT INTO cars (name, stock, image_url) VALUES
    ('Model S 高性能版', 3, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'),
    ('Model X 长续航版', 2, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'),
    ('Model 3 标准版', 5, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'),
    ('Model Y 性能版', 4, 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800');

-- ============================================
-- 6. 启用行级安全策略 (RLS) - 可选但推荐
-- ============================================

-- 启用 RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略（开发阶段）
-- 生产环境中应根据实际需求配置更严格的策略
CREATE POLICY "Enable read access for all users" ON cars
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON cars
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON applications
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON applications
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON contents
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON contents
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 7. 创建视图用于查询（可选）
-- ============================================

-- 创建带有车型信息的申请视图
CREATE VIEW applications_with_cars AS
SELECT
    a.id,
    a.name,
    a.phone,
    a.car_id,
    c.name AS car_name,
    c.image_url AS car_image_url,
    a.platform_url,
    a.keywords,
    a.start_date,
    a.end_date,
    a.status,
    a.created_at,
    a.updated_at
FROM applications a
JOIN cars c ON a.car_id = c.id;

-- 创建带有申请信息的内容视图
CREATE VIEW contents_with_applications AS
SELECT
    co.id,
    co.app_id,
    co.title,
    co.platform,
    co.link,
    co.likes,
    co.collects,
    co.status,
    co.created_at,
    co.updated_at,
    a.name AS applicant_name,
    a.phone AS applicant_phone,
    ca.name AS car_name
FROM contents co
JOIN applications a ON co.app_id = a.id
JOIN cars ca ON a.car_id = ca.id;

-- ============================================
-- 说明
-- ============================================
-- 1. 所有表都使用 UUID 作为主键，更安全且适合分布式系统
-- 2. 添加了必要的索引以优化查询性能
-- 3. created_at 和 updated_at 字段自动维护
-- 4. status 字段使用 CHECK 约束确保数据完整性
-- 5. 使用外键约束确保数据一致性
-- 6. 启用了行级安全策略（RLS）以提高安全性
-- 7. 创建了便于查询的视图

-- 执行完成后，可以通过以下命令验证表是否创建成功：
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
