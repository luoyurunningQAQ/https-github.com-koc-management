import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PATCH - 更新申请状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // 验证状态值
    const validStatuses = ['pending', 'approved', 'driving', 'finished']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '无效的状态值' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('更新状态失败:', error)
      return NextResponse.json(
        { error: '更新状态失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '状态更新成功',
      data
    })

  } catch (error) {
    console.error('处理请求时出错:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
