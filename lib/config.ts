// 环境变量验证和配置工具

export interface EnvConfig {
  supabase: {
    url: string
    anonKey: string
    configured: boolean
  }
  apify: {
    apiKey: string
    actorId: string
    configured: boolean
    isMock: boolean
  }
  feishu: {
    webhookUrl: string
    configured: boolean
    isMock: boolean
  }
}

// 验证必需的环境变量
export function validateRequiredEnv(): void {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`❌ 缺少必需的环境变量: ${missing.join(', ')}`)
  }
}

// 获取环境配置状态
export function getEnvConfig(): EnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const apifyApiKey = process.env.APIFY_API_KEY || ''
  const apifyActorId = process.env.APIFY_ACTOR_ID || ''
  const feishuWebhook = process.env.FEISHU_WEBHOOK_URL || ''

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      configured: supabaseUrl !== 'your-supabase-project-url' && supabaseUrl !== ''
    },
    apify: {
      apiKey: apifyApiKey,
      actorId: apifyActorId,
      configured: apifyApiKey !== 'your-apify-api-key' && apifyApiKey !== '',
      isMock: apifyApiKey === 'your-apify-api-key' || apifyApiKey === ''
    },
    feishu: {
      webhookUrl: feishuWebhook,
      configured: feishuWebhook !== 'your-feishu-webhook-url' && feishuWebhook !== '',
      isMock: feishuWebhook === 'your-feishu-webhook-url' || feishuWebhook === ''
    }
  }
}

// 检查是否有敏感信息泄露
export function checkForLeakedSecrets(text: string): boolean {
  const patterns = [
    /apify_api_[a-zA-Z0-9]{40,}/i,  // Apify API Key
    /eyJ[a-zA-Z0-9_-]{100,}/,        // JWT Token (Supabase)
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,  // Supabase URL (部分可公开)
    /sk-[a-zA-Z0-9]{48}/             // OpenAI API Key
  ]

  return patterns.some(pattern => pattern.test(text))
}

// 脱敏显示敏感信息
export function maskSecret(secret: string, showLength: number = 4): string {
  if (!secret || secret.length <= showLength * 2) {
    return '***'
  }

  const start = secret.substring(0, showLength)
  const end = secret.substring(secret.length - showLength)
  const masked = '*'.repeat(Math.min(secret.length - showLength * 2, 20))

  return `${start}${masked}${end}`
}

// 记录安全警告
export function logSecurityWarning(message: string): void {
  console.warn('🔒 安全警告:', message)
}

// 环境变量配置检查（用于启动时）
export function checkEnvOnStartup(): void {
  try {
    validateRequiredEnv()
    console.log('✅ 必需的环境变量已配置')

    const config = getEnvConfig()

    if (config.apify.isMock) {
      console.warn('⚠️  Apify API Key 未配置，将使用 Mock 数据')
    } else {
      console.log('✅ Apify API 已配置')
    }

    if (config.feishu.isMock) {
      console.warn('⚠️  飞书 Webhook 未配置，将仅打印日志')
    } else {
      console.log('✅ 飞书 Webhook 已配置')
    }

  } catch (error) {
    console.error('❌ 环境变量配置错误:', error)
    throw error
  }
}

// API Key 安全建议
export const SECURITY_RECOMMENDATIONS = `
🔒 API Key 安全建议:

1. ✅ 使用 .env.local 存储所有敏感信息
2. ✅ 确保 .env.local 在 .gitignore 中
3. ✅ 永远不要在代码中硬编码 API Key
4. ✅ 不要将 API Key 写在注释中
5. ✅ 不要共享包含 API Key 的截图或日志
6. ✅ 定期轮换 API Key
7. ✅ 使用最小权限原则
8. ✅ 监控 API 使用量和异常访问
9. ✅ 在 Vercel/服务器上配置环境变量
10. ✅ 使用 Vercel 的 Environment Variables 功能

💰 成本优化建议 (10 个 KOC):

1. ✅ 每 24 小时执行一次监测
2. ✅ 限制每次抓取 20 条内容
3. ✅ 只抓取最近 7 天的内容
4. ✅ 使用 Mock 模式进行开发测试
5. ✅ 配置 Apify 使用量告警
6. ✅ 月度预算控制在 $5 以内

⏰ 推荐定时配置:

schedule: "0 2 * * *"  (每天凌晨 2 点执行)
`
