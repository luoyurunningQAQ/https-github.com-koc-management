import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              试驾车内容管理系统
            </h1>
            <p className="text-xl text-gray-600">
              KOC 试驾申请 & 内容自动监测平台
            </p>
          </div>

          {/* 功能卡片 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* KOC 申请入口 */}
            <Link href="/apply">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-8 hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">KOC 申请入口</h2>
                <p className="text-gray-600 mb-4">
                  提交试驾申请，填写车型和内容关键词
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>立即申请</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* 管理后台入口 */}
            <Link href="/admin">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-8 hover:shadow-2xl hover:border-purple-300 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🔐</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">管理后台</h2>
                <p className="text-gray-600 mb-4">
                  审核申请、监测内容、查看数据统计
                </p>
                <div className="flex items-center text-purple-600 font-medium">
                  <span>进入后台</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* 功能介绍 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">核心功能</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-3">📋</div>
                <h4 className="font-semibold text-gray-900 mb-2">在线申请</h4>
                <p className="text-sm text-gray-600">KOC 在线提交试驾申请，填写关键词</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🤖</div>
                <h4 className="font-semibold text-gray-900 mb-2">自动监测</h4>
                <p className="text-sm text-gray-600">自动抓取匹配内容，智能识别关键词</p>
              </div>
              <div>
                <div className="text-3xl mb-3">📢</div>
                <h4 className="font-semibold text-gray-900 mb-2">飞书推送</h4>
                <p className="text-sm text-gray-600">内容匹配成功后实时推送飞书通知</p>
              </div>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 KOC 试驾车内容管理系统</p>
            <p className="mt-2">由 Claude Code 构建 | Powered by Next.js & Supabase</p>
          </div>
        </div>
      </div>
    </div>
  )
}
