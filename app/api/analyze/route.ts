import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'

export const maxDuration = 30

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    // Fetch the website
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    let html = ''
    let hasSSL = url.startsWith('https')
    let fetchError = ''

    try {
      const response = await fetch(url.startsWith('http') ? url : `https://${url}`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        redirect: 'follow',
      })
      clearTimeout(timeout)
      html = await response.text()
      if (response.url.startsWith('https')) hasSSL = true
    } catch (err: unknown) {
      clearTimeout(timeout)
      const error = err as Error
      fetchError = error.name === 'AbortError' ? 'Site took too long to respond' : `Could not reach website: ${error.message}`
    }

    if (fetchError) {
      return NextResponse.json({ error: fetchError, analysis: null })
    }

    // Extract basic info
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const title = titleMatch?.[1] || 'No title found'
    const description = descMatch?.[1] || 'No meta description'

    // Detect platform
    let platform = 'Unknown'
    if (/wp-content|wordpress/i.test(html)) platform = 'WordPress'
    else if (/wix\.com|wixsite/i.test(html)) platform = 'Wix'
    else if (/squarespace/i.test(html)) platform = 'Squarespace'
    else if (/shopify/i.test(html)) platform = 'Shopify'
    else if (/godaddy|wsimg/i.test(html)) platform = 'GoDaddy Builder'

    // AI analysis
    const trimmedHtml = html.slice(0, 8000)

    const { text: aiResponse } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `You are an expert web consultant analyzing a business website for a potential AI agent integration.

Website URL: ${url}
Platform: ${platform}
Has SSL: ${hasSSL}
Title: ${title}
Description: ${description}

HTML (first 8000 chars):
${trimmedHtml}

Analyze this website and return ONLY a JSON object (no markdown):
{
  "businessName": "detected business name",
  "businessType": "type of business (e.g. plumber, restaurant, law firm)",
  "score": 1-10 (overall website quality),
  "missingElements": ["list of things the site lacks"],
  "aiAgentOpportunities": ["3-5 specific ways an AI chat agent would help this business"],
  "sampleConversation": "Write a 4-message example conversation showing how an AI agent would interact with a visitor on THIS specific business's website. Format: Visitor: ... | Agent: ... | Visitor: ... | Agent: ...",
  "estimatedLeadsLost": "estimate of monthly leads being lost without 24/7 response",
  "recommendation": "one compelling paragraph about why this business needs an AI agent"
}`,
    })

    // Parse AI response
    let analysis = null
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) analysis = JSON.parse(jsonMatch[0])
    } catch {
      analysis = { error: 'Could not parse analysis' }
    }

    return NextResponse.json({
      url,
      title,
      description,
      platform,
      hasSSL,
      analysis,
    })
  } catch (err) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
