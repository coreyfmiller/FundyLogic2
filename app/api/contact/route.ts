import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { name, email, company, budget, message } = await request.json()

    // Only name + email are truly required. The message textarea is optional on the form,
    // so requiring it server-side would silently reject valid leads.
    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Map the "what are you looking for" dropdown to readable text.
    const wantsMap: Record<string, string> = {
      'agent-only': 'AI Agent on existing site',
      'agent-site': 'AI Agent + New Website',
      'not-sure': 'Not sure yet, just exploring',
    }
    const wants = budget ? (wantsMap[budget] || budget) : ''

    await resend.emails.send({
      from: 'FundyLogic <corey@duelly.ai>',
      to: ['coreyfmiller@gmail.com'],
      replyTo: email,
      subject: `New Inquiry from ${name}${company ? ` (${company})` : ''}`,
      html: `<h2>New inquiry from FundyLogic.com</h2>`
        + `<p><strong>Name:</strong> ${name}</p>`
        + `<p><strong>Email:</strong> ${email}</p>`
        + (company ? `<p><strong>Company/Website:</strong> ${company}</p>` : '')
        + (wants ? `<p><strong>Looking for:</strong> ${wants}</p>` : '')
        + (message ? `<p><strong>Message:</strong></p><p>${message}</p>` : '<p><em>No message provided.</em></p>'),
    })

    // Also forward the lead to the Quadropus ops command center (best-effort; email is source of truth).
    void forwardLeadToOps({ source: 'fundylogic', name, email, business: company, wants, message })

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
