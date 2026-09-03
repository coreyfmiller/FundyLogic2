import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { name, email, company, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'FundyLogic <corey@duelly.ai>',
      to: ['coreyfmiller@gmail.com'],
      replyTo: email,
      subject: `New Inquiry from ${name}${company ? ` (${company})` : ''}`,
      html: `<h2>New inquiry from FundyLogic.com</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}<p><strong>Message:</strong></p><p>${message}</p>`,
    })

    // Also forward the lead to the Quadropus ops command center (best-effort; email is source of truth).
    void forwardLeadToOps({ source: 'fundylogic', name, email, business: company, message })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

async function forwardLeadToOps(lead: Record<string, unknown>) {
  const endpoint = process.env.OPS_LEADS_URL
  const token = process.env.LEADS_INGEST_TOKEN
  if (!endpoint || !token) return
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // Ignore: ops forwarding is best-effort.
  }
}
