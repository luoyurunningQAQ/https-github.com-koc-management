import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - 添加车型
export async function POST(request: NextRequest) {
  try {
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
      .insert({
        name: name.trim(),
        stock: stock || 0,
        image_url: image_url || null
      })
      .select()
      .single()

    if (error) {
      console.error('添加车型失败:', error)
      return NextResponse.json(
        { error: '添加车型失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '车型添加成功',
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
