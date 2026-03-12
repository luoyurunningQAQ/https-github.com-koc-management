import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: '已退出登录'
  })

  // 清除 cookie
  response.cookies.delete('admin-auth')

  return response
}
