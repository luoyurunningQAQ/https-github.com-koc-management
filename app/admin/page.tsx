import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LogoutButton from './LogoutButton'

export default async function AdminPage() {
  // 获取统计数据
  const { count: totalApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })

  const { count: pendingApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: drivingApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'driving')

  const { count: totalCars } = await supabase
    .from('cars')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                返回首页
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">总申请数</p>
                <p className="text-3xl font-bold text-gray-900">{totalApplications || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">待审核</p>
                <p className="text-3xl font-bold text-orange-600">{pendingApplications || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">在用车</p>
                <p className="text-3xl font-bold text-green-600">{drivingApplications || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">车型数量</p>
                <p className="text-3xl font-bold text-purple-600">{totalCars || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏎️</span>
              </div>
            </div>
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 车型管理 */}
          <Link href="/admin/cars">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🏎️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    车型管理
                  </h2>
                  <p className="text-gray-600 text-sm">管理车型信息和库存</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>查看所有车型</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>添加新车型</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>修改车型信息</span>
                </li>
              </ul>
            </div>
          </Link>

          {/* 申请审核 */}
          <Link href="/admin/applications">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📋</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    申请审核
                  </h2>
                  <p className="text-gray-600 text-sm">审核和管理 KOC 申请</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>查看所有申请</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>审核通过/发车</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>手动关联内容</span>
                </li>
              </ul>
            </div>
          </Link>

          {/* 内容监测 */}
          <Link href="/admin/monitor">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📡</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    内容监测
                  </h2>
                  <p className="text-gray-600 text-sm">自动抓取和飞书推送</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>自动内容抓取</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>关键词智能匹配</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>飞书实时推送</span>
                </li>
              </ul>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
