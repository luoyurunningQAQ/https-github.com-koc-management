import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, phone, car_id, start_date, end_date, platform_url, keywords } = body

    // 验证必填字段
    if (!name || !phone || !car_id || !start_date || !end_date || !platform_url || !keywords) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: '手机号格式不正确' },
        { status: 400 }
      )
    }

    // 验证日期范围
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return NextResponse.json(
        { error: '开始日期不能早于今天' },
        { status: 400 }
      )
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: '结束日期必须晚于开始日期' },
        { status: 400 }
      )
    }

    // 验证车辆是否存在且有库存
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id, stock')
      .eq('id', car_id)
      .single()

    if (carError || !car) {
      return NextResponse.json(
        { error: '所选车型不存在' },
        { status: 400 }
      )
    }

    if (car.stock <= 0) {
      return NextResponse.json(
        { error: '所选车型暂无库存' },
        { status: 400 }
      )
    }

    // 插入申请数据
    const { data, error } = await supabase
      .from('applications')
      .insert({
        name,
        phone,
        car_id,
        start_date,
        end_date,
        platform_url,
        keywords,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('插入申请失败:', error)
      return NextResponse.json(
        { error: '提交申请失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '申请提交成功',
      data: {
        id: data.id,
        application_number: data.id.split('-')[0].toUpperCase()
      }
    })

  } catch (error) {
    console.error('处理申请时出错:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
