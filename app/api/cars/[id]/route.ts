import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT - 更新车型
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, stock, image_url } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: '车型名称不能为空' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('cars')
      .update({
        name: name.trim(),
        stock: stock || 0,
        image_url: image_url || null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('更新车型失败:', error)
      return NextResponse.json(
        { error: '更新车型失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '车型更新成功',
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
