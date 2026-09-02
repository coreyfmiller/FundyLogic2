import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { BOT_SYSTEM_FACTS } from '@/lib/business-info'

export const maxDuration = 30

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: google('gemini-flash-latest'),
    system: `You are LOGIC, the AI assistant for FundyLogic, an AI studio in Quispamsis, New Brunswick. We build custom AI agents, AI-powered SaaS products, and software with AI integrations.

Your primary goal: be helpful, honest, and never pushy. Answer questions clearly and conversationally. Only suggest services if someone specifically asks about pricing or getting started.

Keep answers concise: 1-3 sentences for simple questions, 4-5 for complex topics.

${BOT_SYSTEM_FACTS}

Be friendly, Atlantic Canadian casual. No em dashes.`,
    messages,
  })

  return result.toTextStreamResponse()
}
