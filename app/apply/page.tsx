import { supabase } from '@/lib/supabase'
import ApplyForm from './ApplyForm'

export default async function ApplyPage() {
  // 从数据库获取车型列表
  const { data: cars } = await supabase
    .from('cars')
    .select('id, name, stock')
    .order('name', { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              试驾车申请
            </h1>
            <p className="text-gray-600">
              填写申请信息，开启您的试驾内容创作之旅
            </p>
          </div>

          {/* 表单卡片 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <h2 className="text-xl font-semibold">申请信息</h2>
              <p className="text-sm text-blue-50 mt-1">
                请填写真实有效的信息，我们将在3个工作日内审核
              </p>
            </div>

            <ApplyForm cars={cars || []} />
          </div>

          {/* 底部提示卡片 */}
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <span>📋</span>
              申请须知
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>请确保填写的手机号准确无误，以便我们及时联系您</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>试驾期间请爱护车辆，遵守交通规则</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>发布内容时请标注相关关键词，便于我们追踪和统计</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>试驾结束后，欢迎分享您的创作内容链接</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
