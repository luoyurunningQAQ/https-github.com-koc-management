'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MonitorPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  // 手动执行监测
  const runMonitor = async () => {
    setIsRunning(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/monitor', {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '监测失败')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '监测失败')
    } finally {
      setIsRunning(false)
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">内容监测</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 说明卡片 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">📡 自动监测说明</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>系统会监测所有状态为"在用车"的 KOC</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>通过 Apify API 抓取 KOC 在小红书/抖音的最新内容</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>匹配逻辑：内容标题/正文必须<strong>同时包含</strong>车型名和 KOC 填写的关键词</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>匹配成功后自动保存内容并推送飞书通知</span>
              </li>
            </ul>
          </div>

          {/* 配置状态 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ 配置状态</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Apify API Key</span>
                <span className={`text-sm font-medium ${
                  process.env.NEXT_PUBLIC_APIFY_API_KEY && process.env.NEXT_PUBLIC_APIFY_API_KEY !== 'your-apify-api-key'
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {process.env.NEXT_PUBLIC_APIFY_API_KEY && process.env.NEXT_PUBLIC_APIFY_API_KEY !== 'your-apify-api-key'
                    ? '✓ 已配置'
                    : '⚠ 未配置 (使用 Mock 数据)'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">飞书 Webhook</span>
                <span className={`text-sm font-medium ${
                  process.env.NEXT_PUBLIC_FEISHU_WEBHOOK_URL && process.env.NEXT_PUBLIC_FEISHU_WEBHOOK_URL !== 'your-feishu-webhook-url'
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {process.env.NEXT_PUBLIC_FEISHU_WEBHOOK_URL && process.env.NEXT_PUBLIC_FEISHU_WEBHOOK_URL !== 'your-feishu-webhook-url'
                    ? '✓ 已配置'
                    : '⚠ 未配置 (仅打印日志)'
                  }
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900 font-medium mb-2">💡 配置提示</p>
              <p className="text-xs text-blue-700">
                在 .env.local 中配置 APIFY_API_KEY 和 FEISHU_WEBHOOK_URL
              </p>
            </div>
          </div>

          {/* 成本优化说明 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-green-900 mb-3">💰 成本优化配置</h2>
            <div className="space-y-3 text-sm text-green-800">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium">推荐频率: 每 24 小时一次</p>
                  <p className="text-xs text-green-700 mt-1">KOC 数量少(10个),每天监测一次即可</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium">抓取限制: 每个 KOC 最多 20 条</p>
                  <p className="text-xs text-green-700 mt-1">降低 API 调用成本</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium">时间范围: 只抓取最近 7 天</p>
                  <p className="text-xs text-green-700 mt-1">避免重复抓取历史内容</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <p className="font-medium">预估成本: &lt; $5/月</p>
                  <p className="text-xs text-green-700 mt-1">在 Apify Free Plan 额度内</p>
                </div>
              </div>
            </div>
          </div>

          {/* 执行按钮 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 执行监测</h2>
            <p className="text-sm text-gray-600 mb-4">
              点击下方按钮手动执行一次内容监测任务
            </p>
            <button
              onClick={runMonitor}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  监测中...
                </span>
              ) : (
                '立即执行监测'
              )}
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-red-900 font-semibold mb-2">❌ 执行失败</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 结果显示 */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-green-900 font-semibold mb-3">✅ 监测完成</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>监测了 <strong>{result.data?.total || 0}</strong> 个在用车的 KOC</p>
                <p>匹配到 <strong>{result.data?.matched || 0}</strong> 条新内容</p>
                {result.data?.matched > 0 && (
                  <p className="mt-3 text-green-700">
                    📢 已发送飞书通知，请查收！
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 定时任务说明 */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-3">⏰ 自动定时任务</h2>
            <div className="mb-4 p-3 bg-purple-100 border border-purple-300 rounded-lg">
              <p className="text-sm font-medium text-purple-900 mb-1">✅ 已配置 Vercel Cron</p>
              <p className="text-xs text-purple-700">每天凌晨 2:00 自动执行监测 (schedule: "0 2 * * *")</p>
            </div>
            <p className="text-sm text-purple-800 mb-3">
              系统已配置自动定时任务,无需手动执行。您也可以：
            </p>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>点击上方按钮手动触发监测</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>修改 vercel.json 中的 schedule 调整执行频率</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>在 Vercel Dashboard 查看执行日志</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
              <p className="text-xs text-purple-900 font-medium mb-2">📊 推荐配置 (10 个 KOC)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-purple-700">执行频率:</span>
                  <span className="text-purple-900 font-medium ml-1">每天 1 次</span>
                </div>
                <div>
                  <span className="text-purple-700">预估成本:</span>
                  <span className="text-purple-900 font-medium ml-1">&lt; $5/月</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
