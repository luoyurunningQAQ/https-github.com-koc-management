import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // 从环境变量获取密码，默认为 admin123
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      // 密码正确，设置 cookie
      const response = NextResponse.json({
        success: true,
        message: '登录成功'
      })

      // 设置 cookie (30 天有效期)
      response.cookies.set('admin-auth', adminPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 天
      })

      return response
    } else {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}
