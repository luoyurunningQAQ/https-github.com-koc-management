'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface ApplyFormProps {
  cars: Array<{
    id: string
    name: string
    stock: number
  }>
}

export default function ApplyForm({ cars }: ApplyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      car_id: formData.get('car_id'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      platform_url: formData.get('platform_url'),
      keywords: formData.get('keywords')
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '提交失败')
      }

      // 显示成功提示
      setApplicationNumber(result.data.application_number)
      setShowSuccess(true)

      // 3秒后跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* 姓名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="请输入您的真实姓名"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        {/* 手机号 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            手机号 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="请输入11位手机号"
            pattern="1[3-9]\d{9}"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        {/* 车型选择 */}
        <div>
          <label htmlFor="car_id" className="block text-sm font-medium text-gray-700 mb-2">
            选择车型 <span className="text-red-500">*</span>
          </label>
          <select
            id="car_id"
            name="car_id"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
          >
            <option value="">请选择车型</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id} disabled={car.stock <= 0}>
                {car.name} {car.stock > 0 ? `(库存: ${car.stock})` : '(暂无库存)'}
              </option>
            ))}
          </select>
        </div>

        {/* 借车日期范围 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              开始日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              结束日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* 平台主页链接 */}
        <div>
          <label htmlFor="platform_url" className="block text-sm font-medium text-gray-700 mb-2">
            小红书/抖音主页链接 <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="platform_url"
            name="platform_url"
            required
            placeholder="https://www.xiaohongshu.com/user/... 或 https://www.douyin.com/user/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
          <p className="mt-2 text-sm text-gray-500">
            请填写您的小红书或抖音主页完整链接
          </p>
        </div>

        {/* 内容关键词 */}
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            内容关键词 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            required
            placeholder="例如：极氪001 露营、特斯拉 自驾游、Model Y 城市通勤"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />

          {/* 引导提示 */}
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  提示：发布内容时包含这些词，系统能更精准地识别您的作品
                </p>
                <p className="text-xs text-blue-700">
                  建议格式：车型名 + 使用场景，多个关键词用空格或逗号分隔
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                提交中...
              </span>
            ) : (
              '提交申请'
            )}
          </button>
        </div>

        {/* 底部说明 */}
        <div className="text-center text-sm text-gray-500 pt-2">
          <p>提交后，我们会在 3 个工作日内完成审核</p>
          <p className="mt-1">审核结果将通过短信通知</p>
        </div>
      </form>

      {/* 成功提示弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h3>
              <p className="text-gray-600 mb-4">您的申请已成功提交</p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">申请编号</p>
                <p className="text-2xl font-bold text-blue-600">{applicationNumber}</p>
              </div>
              <p className="text-sm text-gray-500">
                我们将在 3 个工作日内完成审核<br />
                审核结果将通过短信通知
              </p>
              <p className="text-xs text-gray-400 mt-4">
                3秒后自动跳转...
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
