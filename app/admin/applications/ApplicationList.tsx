'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Application {
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
  cars: {
    id: string
    name: string
    image_url: string | null
  } | null
}

interface ApplicationListProps {
  initialApplications: Application[]
}

const statusConfig = {
  pending: { label: '待审核', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  approved: { label: '已通过', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  driving: { label: '在用车', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  finished: { label: '已完成', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
}

export default function ApplicationList({ initialApplications }: ApplicationListProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  // 更新申请状态
  const updateStatus = async (id: string, newStatus: 'approved' | 'driving') => {
    setLoading(id)
    setError('')

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '更新失败')
      }

      // 更新本地数据
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
    } finally {
      setLoading(null)
    }
  }

  // 过滤申请
  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter)

  return (
    <div>
      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 过滤器 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部 ({applications.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            待审核 ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已通过 ({applications.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('driving')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'driving'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            在用车 ({applications.filter(a => a.status === 'driving').length})
          </button>
        </div>
      </div>

      {/* 申请列表 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">车型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">关键词</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  暂无申请数据
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {app.cars?.image_url && (
                        <img
                          src={app.cars.image_url}
                          alt={app.cars.name}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <span className="text-sm text-gray-900">{app.cars?.name || '未知车型'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(app.start_date).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="text-sm text-gray-500">
                      至 {new Date(app.end_date).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {app.keywords || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusConfig[app.status].bgColor
                    } ${statusConfig[app.status].textColor}`}>
                      {statusConfig[app.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {app.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(app.id, 'approved')}
                        disabled={loading === app.id}
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                      >
                        {loading === app.id ? '处理中...' : '通过'}
                      </button>
                    )}
                    {app.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(app.id, 'driving')}
                        disabled={loading === app.id}
                        className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                      >
                        {loading === app.id ? '处理中...' : '发车'}
                      </button>
                    )}
                    {app.status === 'driving' && (
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        管理内容
                      </Link>
                    )}
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      查看
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
