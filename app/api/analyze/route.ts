import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'

export const maxDuration = 60

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

async function fetchPage(url: string): Promise<{ html: string; ok: boolean }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      redirect: 'follow',
    })
    clearTimeout(timeout)
    if (!res.ok) return { html: '', ok: false }
    const html = await res.text()
    return { html, ok: true }
  } catch {
    return { html: '', ok: false }
  }
}

function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = []
  const regex = /href=["']([^"'#]+)["']/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href
      if (resolved.startsWith(baseUrl)) links.push(resolved)
    } catch {}
  }
  return [...new Set(links)]
}

function findRelevantPages(links: string[], baseUrl: string): Record<string, string | null> {
  const patterns: Record<string, RegExp> = {
    services: /\/(services|what-we-do|offerings|our-work)/i,
    about: /\/(about|who-we-are|our-story|location|areas)/i,
    contact: /\/(contact|get-in-touch|reach-us|book)/i,
    faq: /\/(faq|questions|help|support)/i,
  }

  const found: Record<string, string | null> = {
    services: null,
    about: null,
    contact: null,
    faq: null,
  }

  for (const link of links) {
    for (const [key, pattern] of Object.entries(patterns)) {
      if (!found[key] && pattern.test(link)) {
        found[key] = link
      }
    }
  }

  return found
}

function stripHtml(html: string): string {
  // Remove scripts, styles, then tags, collapse whitespace
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function POST(req: NextRequest) {
  try {
    const { url: rawUrl } = await req.json()
    if (!rawUrl) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const baseUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
    const origin = new URL(baseUrl).origin

    // Step 1: Fetch homepage
    const homepage = await fetchPage(baseUrl)
    if (!homepage.ok) {
      return NextResponse.json({ error: 'Could not reach that website. Check the URL and try again.' })
    }

    const hasSSL = baseUrl.startsWith('https')

    // Extract title and description
    const titleMatch = homepage.html.match(/<title[^>]*>(.*?)<\/title>/i)
    const descMatch = homepage.html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const title = titleMatch?.[1]?.trim() || 'No title found'
    const description = descMatch?.[1]?.trim() || 'No meta description'

    // Detect platform
    let platform = 'Custom / Unknown'
    if (/wp-content|wordpress/i.test(homepage.html)) platform = 'WordPress'
    else if (/wix\.com|wixsite/i.test(homepage.html)) platform = 'Wix'
    else if (/squarespace/i.test(homepage.html)) platform = 'Squarespace'
    else if (/shopify/i.test(homepage.html)) platform = 'Shopify'
    else if (/godaddy|wsimg/i.test(homepage.html)) platform = 'GoDaddy Builder'
    else if (/next/i.test(homepage.html) && /_next/i.test(homepage.html)) platform = 'Next.js'

    // Step 2: Find and fetch relevant pages
    const allLinks = extractLinks(homepage.html, origin)
    const relevantPages = findRelevantPages(allLinks, origin)

    const pages: Record<string, string> = {
      homepage: stripHtml(homepage.html).slice(0, 3000),
    }

    for (const [key, pageUrl] of Object.entries(relevantPages)) {
      if (pageUrl) {
        const page = await fetchPage(pageUrl)
        if (page.ok) {
          pages[key] = stripHtml(page.html).slice(0, 2000)
        }
      }
    }

    const pagesFound = Object.keys(pages)
    const pagesSummary = pagesFound.join(', ')

    // Step 3: AI analysis with structured scoring
    const { text: aiResponse } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `You are an expert analyst assessing a business website for AI chat agent integration. Be factual. Only state things you can observe from the page content. Never invent statistics or numbers you cannot verify.

Website: ${baseUrl}
Platform: ${platform}
SSL: ${hasSSL}
Title: ${title}
Description: ${description}
Pages analyzed: ${pagesSummary}

PAGE CONTENT:
${Object.entries(pages).map(([key, content]) => `--- ${key.toUpperCase()} ---\n${content}`).join('\n\n')}

Return ONLY a valid JSON object (no markdown, no code fences):
{
  "businessName": "detected business name",
  "businessType": "type of business",
  "scores": {
    "responseCapability": {
      "score": 1-10,
      "reasoning": "one sentence explaining what you observed. e.g. 'Only a contact form with 5 fields, no chat, no after-hours option.'"
    },
    "leadCapture": {
      "score": 1-10,
      "reasoning": "one sentence. e.g. 'Contact form exists but requires phone number and has no immediate response mechanism.'"
    },
    "contentCompleteness": {
      "score": 1-10,
      "reasoning": "one sentence. e.g. 'Services listed but no pricing, no FAQ section, limited service area info.'"
    },
    "aiReadiness": {
      "score": 1-10,
      "reasoning": "one sentence. e.g. 'Good content structure with clear services and FAQ that could train an agent well.'"
    }
  },
  "observations": [
    "3-5 factual observations about gaps or opportunities. Each must be something you can see from the page content. Never invent numbers. Examples: 'No way to engage visitors outside business hours', 'Contact form has 6 fields which adds friction', 'No FAQ section to address common questions', 'Services are listed but pricing requires a phone call'"
  ],
  "aiAgentOpportunities": [
    "3-4 specific ways an AI agent would help THIS business based on what you see"
  ],
  "sampleConversation": "A realistic 4-message conversation between a visitor and an AI agent on this specific site. Format each message on its own line prefixed with 'Visitor:' or 'Agent:'. Make it specific to this business.",
  "recommendation": "2-3 sentences about why this business would benefit from an AI agent. Be specific to what you observed. No hype."
}`,
    })

    // Parse response
    let analysis = null
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) analysis = JSON.parse(jsonMatch[0])
    } catch {
      analysis = null
    }

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis failed. Try again.' })
    }

    return NextResponse.json({
      url: baseUrl,
      title,
      description,
      platform,
      hasSSL,
      pagesAnalyzed: pagesFound,
      analysis,
    })
  } catch (err) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
