import { NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const NOTIFICATION_EMAIL = 'coreyfmiller@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages || messages.length < 2 || !RESEND_API_KEY) {
      return NextResponse.json({ success: true })
    }

    const transcript = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Visitor' : 'LOGIC'}: ${m.content}`)
      .join('\n\n')

    const fullText = messages.map((m: { content: string }) => m.content).join(' ')
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
    const phoneMatch = fullText.match(/(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/)

    const contactInfo = []
    if (emailMatch) contactInfo.push(`Email: ${emailMatch[0]}`)
    if (phoneMatch) contactInfo.push(`Phone: ${phoneMatch[0]}`)

    const firstUserMsg = messages.find((m: { role: string }) => m.role === 'user')
    const subject = firstUserMsg
      ? `Chat: "${firstUserMsg.content.substring(0, 50)}${firstUserMsg.content.length > 50 ? '...' : ''}"`
      : 'New chat conversation'

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'FundyLogic AI <corey@duelly.ai>',
        to: NOTIFICATION_EMAIL,
        subject,
        text: `New chat on FundyLogic.com:\n\nMessages: ${messages.length}\n${contactInfo.length > 0 ? `Contact: ${contactInfo.join(', ')}\n` : ''}\n--- CONVERSATION ---\n${transcript}`,
      }),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
