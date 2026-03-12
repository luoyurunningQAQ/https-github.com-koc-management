// 飞书 Webhook 推送

export interface FeishuMessageData {
  kocName: string
  carName: string
  matchType: 'auto' | 'manual'
  contentTitle: string
  contentLink: string
  platform: string
  likes: number
  comments?: number
  shares?: number
  collects: number
  publishTime?: string
  keywords?: string
}

// 发送飞书卡片消息
export async function sendFeishuCard(data: FeishuMessageData, webhookUrl?: string): Promise<boolean> {
  const url = webhookUrl || process.env.FEISHU_WEBHOOK_URL

  if (!url || url === 'your-feishu-webhook-url') {
    console.log('📢 [飞书推送 Mock] 未配置 Webhook，仅打印消息:')
    console.log(JSON.stringify(data, null, 2))
    return true
  }

  try {
    const card = buildFeishuCard(data)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(card)
    })

    if (!response.ok) {
      throw new Error(`飞书推送失败: ${response.status}`)
    }

    const result = await response.json()

    if (result.code !== 0) {
      throw new Error(`飞书返回错误: ${result.msg}`)
    }

    console.log('✅ 飞书推送成功')
    return true

  } catch (error) {
    console.error('❌ 飞书推送失败:', error)
    return false
  }
}

// 构建飞书卡片消息
function buildFeishuCard(data: FeishuMessageData) {
  const matchTypeText = data.matchType === 'auto' ? '🤖 自动监测' : '👤 手动关联'
  const matchTypeColor = data.matchType === 'auto' ? 'green' : 'blue'

  return {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: '🎉 新内容匹配成功'
        },
        template: matchTypeColor
      },
      elements: [
        // KOC 信息
        {
          tag: 'div',
          fields: [
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**KOC 姓名**\n${data.kocName}`
              }
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**关联车型**\n${data.carName}`
              }
            }
          ]
        },
        // 匹配方式
        {
          tag: 'div',
          fields: [
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**匹配方式**\n${matchTypeText}`
              }
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**平台**\n${data.platform}`
              }
            }
          ]
        },
        // 分割线
        {
          tag: 'hr'
        },
        // 内容标题
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**内容标题**\n${data.contentTitle}`
          }
        },
        // 关键词 (如果有)
        ...(data.keywords ? [{
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**匹配关键词**\n${data.keywords}`
          }
        }] : []),
        // 分割线
        {
          tag: 'hr'
        },
        // 互动数据
        {
          tag: 'div',
          fields: [
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**👍 点赞数**\n${data.likes.toLocaleString()}`
              }
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**⭐ 收藏数**\n${data.collects.toLocaleString()}`
              }
            }
          ]
        },
        ...(data.comments || data.shares ? [{
          tag: 'div',
          fields: [
            ...(data.comments ? [{
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**💬 评论数**\n${data.comments.toLocaleString()}`
              }
            }] : []),
            ...(data.shares ? [{
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**🔄 分享数**\n${data.shares.toLocaleString()}`
              }
            }] : [])
          ]
        }] : []),
        // 发布时间 (如果有)
        ...(data.publishTime ? [{
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**发布时间**\n${new Date(data.publishTime).toLocaleString('zh-CN')}`
          }
        }] : []),
        // 分割线
        {
          tag: 'hr'
        },
        // 操作按钮
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: {
                tag: 'plain_text',
                content: '查看内容'
              },
              type: 'primary',
              url: data.contentLink
            }
          ]
        },
        // 底部注释
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: '由 KOC 管理系统自动推送'
            }
          ]
        }
      ]
    }
  }
}

// 发送简单文本消息 (用于测试)
export async function sendFeishuText(text: string, webhookUrl?: string): Promise<boolean> {
  const url = webhookUrl || process.env.FEISHU_WEBHOOK_URL

  if (!url || url === 'your-feishu-webhook-url') {
    console.log('📢 [飞书推送 Mock]:', text)
    return true
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        msg_type: 'text',
        content: {
          text
        }
      })
    })

    if (!response.ok) {
      throw new Error(`飞书推送失败: ${response.status}`)
    }

    return true

  } catch (error) {
    console.error('❌ 飞书推送失败:', error)
    return false
  }
}

// 发送批量内容汇总
export async function sendFeishuBatchSummary(
  contents: FeishuMessageData[],
  webhookUrl?: string
): Promise<boolean> {
  const url = webhookUrl || process.env.FEISHU_WEBHOOK_URL

  if (!url || url === 'your-feishu-webhook-url') {
    console.log('📢 [飞书批量推送 Mock]:', `发现 ${contents.length} 条新内容`)
    return true
  }

  const summary = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: `📊 内容监测汇总 (${contents.length} 条)`
        },
        template: 'blue'
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `本次监测发现 **${contents.length}** 条新内容`
          }
        },
        {
          tag: 'hr'
        },
        ...contents.slice(0, 5).map((data, index) => ({
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `${index + 1}. **${data.kocName}** - ${data.carName}\n   ${data.contentTitle}\n   👍 ${data.likes} | ⭐ ${data.collects}`
          }
        })),
        ...(contents.length > 5 ? [{
          tag: 'div',
          text: {
            tag: 'plain_text',
            content: `... 还有 ${contents.length - 5} 条内容`
          }
        }] : [])
      ]
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(summary)
    })

    return response.ok

  } catch (error) {
    console.error('❌ 飞书批量推送失败:', error)
    return false
  }
}
