import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ContentManager from './ContentManager'

export default async function ApplicationDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // 获取申请详情
  const { data: application, error } = await supabase
    .from('applications')
    .select(`
      *,
      cars:car_id (
        id,
        name,
        image_url
      )
    `)
    .eq('id', id)
    .single()

  if (error || !application) {
    notFound()
  }

  // 获取关联的内容
  const { data: contents } = await supabase
    .from('contents')
    .select('*')
    .eq('app_id', id)
    .order('created_at', { ascending: false })

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'orange' },
    approved: { label: '已通过', color: 'blue' },
    driving: { label: '在用车', color: 'green' },
    finished: { label: '已完成', color: 'gray' }
  }

  const currentStatus = statusConfig[application.status] || statusConfig.pending

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/applications" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
            ← 返回申请列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">申请详情</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：申请信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">申请信息</h2>

              <div className="space-y-4">
                {/* 状态 */}
                <div>
                  <label className="text-sm text-gray-500">状态</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${currentStatus.color}-100 text-${currentStatus.color}-800`}>
                      {currentStatus.label}
                    </span>
                  </div>
                </div>

                {/* 申请人 */}
                <div>
                  <label className="text-sm text-gray-500">申请人</label>
                  <div className="mt-1 text-gray-900 font-medium">{application.name}</div>
                </div>

                {/* 手机号 */}
                <div>
                  <label className="text-sm text-gray-500">手机号</label>
                  <div className="mt-1 text-gray-900">{application.phone}</div>
                </div>

                {/* 车型 */}
                <div>
                  <label className="text-sm text-gray-500">车型</label>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      {application.cars?.image_url && (
                        <img
                          src={application.cars.image_url}
                          alt={application.cars.name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <span className="text-gray-900 font-medium">{application.cars?.name}</span>
                    </div>
                  </div>
                </div>

                {/* 日期 */}
                <div>
                  <label className="text-sm text-gray-500">用车日期</label>
                  <div className="mt-1 text-gray-900">
                    {new Date(application.start_date).toLocaleDateString('zh-CN')}
                    {' 至 '}
                    {new Date(application.end_date).toLocaleDateString('zh-CN')}
                  </div>
                </div>

                {/* 平台链接 */}
                <div>
                  <label className="text-sm text-gray-500">平台主页</label>
                  <div className="mt-1">
                    <a
                      href={application.platform_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {application.platform_url}
                    </a>
                  </div>
                </div>

                {/* 关键词 */}
                <div>
                  <label className="text-sm text-gray-500">内容关键词</label>
                  <div className="mt-1 text-gray-900">
                    {application.keywords || '-'}
                  </div>
                </div>

                {/* 申请时间 */}
                <div>
                  <label className="text-sm text-gray-500">申请时间</label>
                  <div className="mt-1 text-gray-900 text-sm">
                    {new Date(application.created_at).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：内容管理 */}
          <div className="lg:col-span-2">
            <ContentManager
              applicationId={application.id}
              applicationStatus={application.status}
              initialContents={contents || []}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
