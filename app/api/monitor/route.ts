import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { crawlWithApify, matchKeywords, parseKeywords } from '@/lib/crawler'
import { sendFeishuCard } from '@/lib/feishu'

// POST - 执行自动监测
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 开始执行自动监测任务...')

    // 获取所有 driving 状态的申请
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        id,
        name,
        phone,
        car_id,
        platform_url,
        keywords,
        cars:car_id (
          id,
          name
        )
      `)
      .eq('status', 'driving')

    if (error) {
      throw new Error(`查询申请失败: ${error.message}`)
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        success: true,
        message: '没有需要监测的 KOC',
        data: {
          total: 0,
          matched: 0
        }
      })
    }

    console.log(`📋 找到 ${applications.length} 个在用车的 KOC`)

    let totalMatched = 0
    const apifyApiKey = process.env.APIFY_API_KEY || 'your-apify-api-key'

    // 遍历每个申请进行抓取
    for (const app of applications) {
      try {
        console.log(`\n🔍 监测 KOC: ${app.name} (${app.cars?.name})`)

        // 解析关键词
        const keywords = parseKeywords(app.keywords)
        if (keywords.length === 0) {
          console.log('  ⚠️  未设置关键词，跳过')
          continue
        }

        console.log(`  🔑 关键词: ${keywords.join(', ')}`)

        // 判断平台
        const platform = detectPlatform(app.platform_url)
        console.log(`  📱 平台: ${platform}`)

        // 调用爬虫 (Apify 或 Mock)
        const crawledContents = await crawlWithApify(
          {
            applicationId: app.id,
            platform,
            platformUrl: app.platform_url,
            carName: app.cars?.name || '',
            keywords
          },
          apifyApiKey
        )

        console.log(`  📦 抓取到 ${crawledContents.length} 条内容`)

        // 匹配关键词
        for (const content of crawledContents) {
          const isMatch = matchKeywords(content, app.cars?.name || '', keywords)

          if (isMatch) {
            console.log(`  ✅ 匹配成功: ${content.title}`)

            // 检查是否已存在
            const { data: existingContent } = await supabase
              .from('contents')
              .select('id')
              .eq('app_id', app.id)
              .eq('link', content.url)
              .single()

            if (existingContent) {
              console.log('    ℹ️  内容已存在，跳过')
              continue
            }

            // 存入数据库
            const { data: newContent, error: insertError } = await supabase
              .from('contents')
              .insert({
                app_id: app.id,
                title: content.title,
                platform: content.platform,
                link: content.url,
                likes: content.likes,
                collects: content.collects,
                status: 'auto' // 自动抓取
              })
              .select()
              .single()

            if (insertError) {
              console.error('    ❌ 插入失败:', insertError.message)
              continue
            }

            console.log('    💾 已保存到数据库')
            totalMatched++

            // 发送飞书通知
            const feishuSuccess = await sendFeishuCard({
              kocName: app.name,
              carName: app.cars?.name || '',
              matchType: 'auto',
              contentTitle: content.title,
              contentLink: content.url,
              platform: content.platform,
              likes: content.likes,
              comments: content.comments,
              shares: content.shares,
              collects: content.collects,
              publishTime: content.publishTime,
              keywords: keywords.join(', ')
            })

            if (feishuSuccess) {
              console.log('    📢 飞书推送成功')
            }
          } else {
            console.log(`  ⏭️  不匹配: ${content.title}`)
          }
        }

      } catch (err) {
        console.error(`❌ 处理 KOC ${app.name} 时出错:`, err)
        continue
      }
    }

    console.log(`\n✅ 监测完成！共匹配 ${totalMatched} 条新内容`)

    return NextResponse.json({
      success: true,
      message: `监测完成，共匹配 ${totalMatched} 条新内容`,
      data: {
        total: applications.length,
        matched: totalMatched
      }
    })

  } catch (error) {
    console.error('❌ 自动监测失败:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '监测失败'
      },
      { status: 500 }
    )
  }
}

// 检测平台
function detectPlatform(url: string): string {
  if (url.includes('xiaohongshu.com')) return '小红书'
  if (url.includes('douyin.com')) return '抖音'
  if (url.includes('weibo.com')) return '微博'
  return 'unknown'
}
