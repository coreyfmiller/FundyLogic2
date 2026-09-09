import { NextRequest, NextResponse } from 'next/server'

/**
 * Vapi server webhook. Vapi POSTs call events here; we care about "end-of-call-report",
 * which fires when a phone call finishes. We email the summary, the captured structured
 * lead, and the transcript so voice leads actually reach us (they otherwise only live in
 * the Vapi dashboard).
 *
 * Point the assistant's server.url at https://fundylogic.com/api/vapi-webhook
 * (the sync-vapi script sets this).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const NOTIFICATION_EMAIL = 'coreyfmiller@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body?.message ?? body

    // Only act on the end-of-call report; ack everything else so Vapi is happy.
    if (message?.type !== 'end-of-call-report') {
      return NextResponse.json({ received: true })
    }

    const call = message.call ?? {}
    const customerNumber = call?.customer?.number || message?.customer?.number || 'unknown'
    const summary: string = message.summary || call.summary || ''
    const transcript: string = message.transcript || call.transcript || ''
    const recordingUrl: string = message.recordingUrl || message.artifact?.recordingUrl || ''
    const endedReason: string = message.endedReason || call.endedReason || ''
    const durationSec = message?.durationSeconds ? Math.round(message.durationSeconds) : ''

    // Structured lead, if the assistant's analysis plan produced one.
    const structured = message.analysis?.structuredData || message.structuredData || null

    // Fallback contact extraction from the transcript (in case structured data is missing).
    const emailMatch = transcript.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
    const phoneMatch = transcript.match(/(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/)

    if (!RESEND_API_KEY) {
      // Nothing to send with; still ack so Vapi does not retry forever.
      return NextResponse.json({ received: true })
    }

    const structuredBlock = structured
      ? `\n--- CAPTURED LEAD ---\n${Object.entries(structured)
          .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
          .join('\n')}\n`
      : ''

    const contactLines: string[] = []
    contactLines.push(`Called number: ${customerNumber}`)
    if (emailMatch) contactLines.push(`Email (from transcript): ${emailMatch[0]}`)
    if (phoneMatch) contactLines.push(`Phone (from transcript): ${phoneMatch[0]}`)

    const text =
      `New PHONE lead from the FundyLogic voice agent.\n\n` +
      `${contactLines.join('\n')}\n` +
      (durationSec ? `Duration: ${durationSec}s\n` : '') +
      (endedReason ? `Ended: ${endedReason}\n` : '') +
      (recordingUrl ? `Recording: ${recordingUrl}\n` : '') +
      structuredBlock +
      (summary ? `\n--- SUMMARY ---\n${summary}\n` : '') +
      (transcript ? `\n--- TRANSCRIPT ---\n${transcript}\n` : '')

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'FundyLogic Voice <corey@duelly.ai>',
        to: NOTIFICATION_EMAIL,
        subject: `New phone lead from voice agent (${customerNumber})`,
        text,
      }),
    })

    // Best-effort forward to the Quadropus ops center, mirroring the contact form.
    void forwardLeadToOps({
      source: 'fundylogic-voice',
      phone: customerNumber,
      email: emailMatch?.[0],
      summary,
      structured,
    })

    return NextResponse.json({ received: true })
  } catch {
    // Always 200 so Vapi does not hammer retries; we log nothing sensitive.
    return NextResponse.json({ received: true })
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
    // ignore, best-effort
  }
}
