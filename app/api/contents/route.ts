import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendFeishuCard } from '@/lib/feishu'

// Mock API - 模拟获取内容数据
async function mockFetchContentData(url: string) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 判断平台
  let platform = 'unknown'
  if (url.includes('xiaohongshu.com')) {
    platform = '小红书'
  } else if (url.includes('douyin.com')) {
    platform = '抖音'
  } else if (url.includes('weibo.com')) {
    platform = '微博'
  }

  // 生成模拟数据
  const mockTitles = [
    '试驾体验 | 这台车真的太适合城市通勤了！',
    '周末自驾游 Vlog | 带你看看这台车的实力',
    '新能源汽车测评 | 续航表现超预期',
    '露营神器！这台车的空间利用率绝了',
    '科技感拉满！车机系统体验分享',
    '高速体验 | 动力表现让我惊喜',
    '家用首选？看完这个视频你就知道了',
    '颜值即正义！这个设计我爱了'
  ]

  const title = mockTitles[Math.floor(Math.random() * mockTitles.length)]
  const likes = Math.floor(Math.random() * 10000) + 500
  const collects = Math.floor(Math.random() * 5000) + 200

  return {
    title,
    platform,
    link: url,
    likes,
    collects
  }
}

// POST - 添加内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { app_id, link } = body

    // 验证必填字段
    if (!app_id || !link) {
      return NextResponse.json(
        { error: '缺少必填参数' },
        { status: 400 }
      )
    }

    // 验证 URL 格式
    try {
      new URL(link)
    } catch {
      return NextResponse.json(
        { error: '无效的链接地址' },
        { status: 400 }
      )
    }

    // 验证申请是否存在,并获取 KOC 和车型信息
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        id,
        name,
        status,
        cars:car_id (
          name
        )
      `)
      .eq('id', app_id)
      .single()

    if (appError || !application) {
      return NextResponse.json(
        { error: '申请不存在' },
        { status: 404 }
      )
    }

    // 检查是否已存在相同链接
    const { data: existingContent } = await supabase
      .from('contents')
      .select('id')
      .eq('app_id', app_id)
      .eq('link', link)
      .single()

    if (existingContent) {
      return NextResponse.json(
        { error: '该内容链接已存在' },
        { status: 400 }
      )
    }

    // 调用 Mock API 获取内容数据
    const contentData = await mockFetchContentData(link)

    // 插入到数据库
    const { data, error } = await supabase
      .from('contents')
      .insert({
        app_id,
        title: contentData.title,
        platform: contentData.platform,
        link: contentData.link,
        likes: contentData.likes,
        collects: contentData.collects,
        status: 'manual' // 手动添加
      })
      .select()
      .single()

    if (error) {
      console.error('插入内容失败:', error)
      return NextResponse.json(
        { error: '添加内容失败' },
        { status: 500 }
      )
    }

    // 发送飞书通知
    try {
      await sendFeishuCard({
        kocName: application.name,
        carName: (application.cars as any)?.name || '',
        matchType: 'manual',
        contentTitle: contentData.title,
        contentLink: contentData.link,
        platform: contentData.platform,
        likes: contentData.likes,
        collects: contentData.collects
      })
      console.log('✅ 飞书推送成功')
    } catch (feishuError) {
      console.error('⚠️  飞书推送失败:', feishuError)
      // 不影响主流程
    }

    return NextResponse.json({
      success: true,
      message: '内容添加成功',
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
