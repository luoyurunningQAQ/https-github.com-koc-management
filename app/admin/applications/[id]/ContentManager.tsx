'use client'

import { useState } from 'react'

interface Content {
  id: string
  title: string
  platform: string
  link: string
  likes: number
  collects: number
  status: 'auto' | 'manual'
  created_at: string
}

interface ContentManagerProps {
  applicationId: string
  applicationStatus: string
  initialContents: Content[]
}

export default function ContentManager({
  applicationId,
  applicationStatus,
  initialContents
}: ContentManagerProps) {
  const [contents, setContents] = useState<Content[]>(initialContents)
  const [linkInput, setLinkInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 手动添加内容链接
  const addContent = async () => {
    if (!linkInput.trim()) {
      setError('请输入内容链接')
      return
    }

    // 验证链接格式
    try {
      new URL(linkInput)
    } catch {
      setError('请输入有效的链接地址')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: applicationId,
          link: linkInput
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '添加失败')
      }

      // 添加到列表
      setContents([result.data, ...contents])
      setLinkInput('')
      setSuccess('内容已成功关联！')

      // 3秒后清除成功提示
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">内容管理</h2>
        <p className="text-sm text-gray-500 mt-1">
          {applicationStatus === 'driving'
            ? '手动添加或查看该 KOC 发布的内容'
            : '车辆状态为"在用车"时才能添加内容'
          }
        </p>
      </div>

      {/* 手动添加内容 */}
      {applicationStatus === 'driving' && (
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">手动添加内容链接</h3>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 成功提示 */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="粘贴小红书或抖音内容链接..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addContent()
                }
              }}
            />
            <button
              onClick={addContent}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '关联中...' : '关联'}
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            <p className="mb-1">💡 支持的平台：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>小红书笔记链接 (xiaohongshu.com)</li>
              <li>抖音视频链接 (douyin.com)</li>
            </ul>
            <p className="mt-2">粘贴链接后系统会自动获取内容信息(标题、点赞、收藏等)</p>
          </div>
        </div>
      )}

      {/* 内容列表 */}
      <div>
        {contents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📝</div>
            <p>暂无关联内容</p>
            {applicationStatus === 'driving' && (
              <p className="text-sm mt-2">请手动添加该 KOC 发布的内容链接</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contents.map((content) => (
              <div key={content.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {content.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        content.status === 'auto'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {content.status === 'auto' ? '自动抓取' : '手动添加'}
                      </span>
                    </div>

                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {content.link}
                    </a>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>👍</span>
                        <span>{content.likes.toLocaleString()} 点赞</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{content.collects.toLocaleString()} 收藏</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📱</span>
                        <span>{content.platform}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      添加时间: {new Date(content.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {contents.length > 0 && (
          <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
            共 {contents.length} 条内容
          </div>
        )}
      </div>
    </div>
  )
}
