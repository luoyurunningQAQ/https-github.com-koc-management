import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ApplicationList from './ApplicationList'

export default async function ApplicationsPage() {
  // 获取所有申请,关联车型信息
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      cars:car_id (
        id,
        name,
        image_url
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
                ← 返回后台
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">申请审核</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">申请列表</h2>
              <div className="text-sm text-gray-600">
                共 {applications?.length || 0} 条申请
              </div>
            </div>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-600">
              加载失败: {error.message}
            </div>
          ) : (
            <ApplicationList initialApplications={applications || []} />
          )}
        </div>
      </div>
    </div>
  )
}
