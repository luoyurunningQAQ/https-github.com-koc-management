import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 管理后台密码验证
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 只保护 /admin 路径
  if (pathname.startsWith('/admin')) {
    // 检查是否已登录
    const authToken = request.cookies.get('admin-auth')?.value

    // 验证 token
    const validToken = process.env.ADMIN_PASSWORD || 'admin123'

    if (authToken !== validToken) {
      // 未登录，重定向到登录页
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
