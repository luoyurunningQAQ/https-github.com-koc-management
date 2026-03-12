// 数据库表类型定义

export interface Car {
  id: string
  name: string
  stock: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  name: string
  phone: string
  car_id: string
  platform_url: string
  keywords: string | null
  start_date: string
  end_date: string
  status: 'pending' | 'approved' | 'driving' | 'finished'
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  app_id: string
  title: string
  platform: string
  link: string
  likes: number
  collects: number
  status: 'auto' | 'manual'
  created_at: string
  updated_at: string
}

// 扩展类型：带有车型信息的申请
export interface ApplicationWithCar extends Application {
  car_name: string
  car_image_url: string | null
}

// 扩展类型：带有申请信息的内容
export interface ContentWithApplication extends Content {
  applicant_name: string
  applicant_phone: string
  car_name: string
}

// 表单提交类型
export interface ApplicationFormData {
  name: string
  phone: string
  car_id: string
  platform_url: string
  keywords?: string
  start_date: string
  end_date: string
}

export interface ContentFormData {
  app_id: string
  title: string
  platform: string
  link: string
  likes?: number
  collects?: number
  status?: 'auto' | 'manual'
}
