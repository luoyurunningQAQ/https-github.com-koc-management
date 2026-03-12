// Apify API 抓取引擎配置

export interface ApifyConfig {
  apiKey: string
  actorId: string
  timeout: number
}

export interface CrawlTask {
  applicationId: string
  platform: string
  platformUrl: string
  carName: string
  keywords: string[]
}

export interface CrawledContent {
  title: string
  content: string
  url: string
  likes: number
  comments: number
  shares: number
  collects: number
  publishTime: string
  platform: string
}

// Mock 数据生成器 (当没有 API Key 时使用)
export function generateMockContent(task: CrawlTask): CrawledContent[] {
  const mockTitles = [
    `${task.carName} ${task.keywords[0]} 真实体验分享`,
    `周末带着 ${task.carName} 去${task.keywords[0]}，太爽了！`,
    `${task.carName}车主的${task.keywords[0]}日记`,
    `这台${task.carName}让我的${task.keywords[0]}体验升级了`,
    `${task.carName} + ${task.keywords[0]} = 完美组合`,
    `${task.keywords[0]}必备神器：${task.carName}`,
    `入手${task.carName}后的首次${task.keywords[0]}`,
    `${task.carName}实测：${task.keywords[0]}场景表现如何？`
  ]

  const mockContents = [
    `最近入手了${task.carName}，今天带它去${task.keywords[0]}了！整体体验超出预期，特别是...`,
    `作为${task.carName}车主，这次${task.keywords[0]}的体验让我印象深刻。首先是空间表现...`,
    `终于等到周末，开着${task.carName}去${task.keywords[0]}。这台车在${task.keywords[0]}场景下的表现...`,
    `${task.carName}的${task.keywords[0]}实测来了！先说结论：非常适合...`
  ]

  // 随机生成 1-3 条模拟内容
  const count = Math.floor(Math.random() * 3) + 1
  const results: CrawledContent[] = []

  for (let i = 0; i < count; i++) {
    const title = mockTitles[Math.floor(Math.random() * mockTitles.length)]
    const content = mockContents[Math.floor(Math.random() * mockContents.length)]

    results.push({
      title,
      content,
      url: `https://www.${task.platform}.com/content/${Date.now()}_${i}`,
      likes: Math.floor(Math.random() * 10000) + 500,
      comments: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 1000) + 100,
      collects: Math.floor(Math.random() * 3000) + 200,
      publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      platform: task.platform
    })
  }

  return results
}

// Apify API 调用 (真实 API)
export async function crawlWithApify(task: CrawlTask, apiKey: string): Promise<CrawledContent[]> {
  // 如果没有 API Key，使用 Mock 数据
  if (!apiKey || apiKey === 'your-apify-api-key') {
    console.log('使用 Mock 数据 (未配置 Apify API Key)')
    return generateMockContent(task)
  }

  try {
    // TODO: 实际的 Apify API 调用
    // 这里是示例代码,需要根据实际的 Apify Actor 进行调整

    const actorInput = {
      profileUrl: task.platformUrl,
      maxItems: 20,  // 🔧 成本优化: 限制为 20 条内容
      platform: task.platform,
      // 只抓取最近 7 天的内容
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    const response = await fetch(`https://api.apify.com/v2/acts/${process.env.APIFY_ACTOR_ID}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ input: actorInput })
    })

    if (!response.ok) {
      throw new Error('Apify API 调用失败')
    }

    const result = await response.json()

    // 等待 Actor 运行完成
    const runId = result.data.id
    let runStatus = await waitForRunCompletion(runId, apiKey)

    // 获取结果
    const datasetId = runStatus.defaultDatasetId
    const items = await fetchDatasetItems(datasetId, apiKey)

    return items

  } catch (error) {
    console.error('Apify API 调用失败，使用 Mock 数据:', error)
    return generateMockContent(task)
  }
}

// 等待 Apify Actor 运行完成
async function waitForRunCompletion(runId: string, apiKey: string, maxWaitTime = 300000): Promise<any> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    const result = await response.json()
    const status = result.data.status

    if (status === 'SUCCEEDED') {
      return result.data
    } else if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Actor 运行失败: ${status}`)
    }

    // 等待 5 秒后重试
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  throw new Error('Actor 运行超时')
}

// 获取 Dataset 中的数据
async function fetchDatasetItems(datasetId: string, apiKey: string): Promise<CrawledContent[]> {
  const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  })

  if (!response.ok) {
    throw new Error('获取数据失败')
  }

  const items = await response.json()
  return items.map((item: any) => ({
    title: item.title || '',
    content: item.text || item.description || '',
    url: item.url || '',
    likes: item.likes || item.diggCount || 0,
    comments: item.comments || item.commentCount || 0,
    shares: item.shares || item.shareCount || 0,
    collects: item.collects || item.collectCount || 0,
    publishTime: item.createTime || item.publishTime || new Date().toISOString(),
    platform: item.platform || 'unknown'
  }))
}

// 关键词匹配逻辑
export function matchKeywords(content: CrawledContent, carName: string, keywords: string[]): boolean {
  const textToMatch = `${content.title} ${content.content}`.toLowerCase()
  const carNameLower = carName.toLowerCase()

  // 必须包含车型名
  if (!textToMatch.includes(carNameLower)) {
    return false
  }

  // 必须包含至少一个关键词
  const hasKeyword = keywords.some(keyword =>
    textToMatch.includes(keyword.toLowerCase())
  )

  return hasKeyword
}

// 解析关键词字符串
export function parseKeywords(keywordsStr: string | null): string[] {
  if (!keywordsStr) return []

  // 支持空格、逗号、顿号分隔
  return keywordsStr
    .split(/[,，\s、]+/)
    .map(k => k.trim())
    .filter(k => k.length > 0)
}
