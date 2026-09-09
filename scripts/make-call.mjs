/**
 * Place an OUTBOUND call with the FundyLogic voice bot. Dependency-free (plain node).
 *
 * The bot dials the destination number from our Twilio number (+15063155111) and, when the
 * person answers, the LOGIC voice assistant talks to them using its system prompt.
 *
 * Usage:
 *   npm run make-call -- +15065551234       (pass the destination after --)
 *   or set CALL_TO=+15065551234 in .env.local and run  npm run make-call
 *
 * Requires in .env.local:  VAPI_PRIVATE_KEY, VAPI_ASSISTANT_ID  (already set)
 * The imported phone number is looked up automatically.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { VAPI_OUTBOUND_GREETING } from '../lib/vapi-voice-prompt.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://api.vapi.ai'

function loadEnvLocal() {
  const env = {}
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const k = t.slice(0, eq).trim()
      let v = t.slice(eq + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      env[k] = v
    }
  } catch { /* fall back to process.env */ }
  return env
}

// Normalize a dialed number to E.164 (default to +1 North America if no country code).
function toE164(input) {
  if (!input) return ''
  const trimmed = input.trim()
  if (trimmed.startsWith('+')) return trimmed
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return `+${digits}`
}

async function main() {
  const e = loadEnvLocal()
  const KEY = process.env.VAPI_PRIVATE_KEY || e.VAPI_PRIVATE_KEY
  const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || e.VAPI_ASSISTANT_ID
  const argTo = process.argv[2]
  const TO = toE164(argTo || process.env.CALL_TO || e.CALL_TO || '')

  if (!KEY) throw new Error('VAPI_PRIVATE_KEY is not set (add it to .env.local)')
  if (!ASSISTANT_ID) throw new Error('VAPI_ASSISTANT_ID is not set (add it to .env.local)')
  if (!TO) throw new Error('No destination number. Run:  npm run make-call -- +15065551234  (or set CALL_TO in .env.local)')

  const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

  // Find our imported phone number id (the "from").
  const pnRes = await fetch(`${BASE}/phone-number`, { headers })
  if (!pnRes.ok) throw new Error(`Could not list phone numbers: ${pnRes.status} ${await pnRes.text()}`)
  const numbers = await pnRes.json()
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('No phone number registered in Vapi. Run  npm run import-number  first.')
  }
  const phoneNumberId = numbers[0].id
  const fromNumber = numbers[0].number

  // Place the outbound call.
  const res = await fetch(`${BASE}/call`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      phoneNumberId,
      assistantId: ASSISTANT_ID,
      customer: { number: TO },
      // Outbound calls need a "we are calling you" opener, not the inbound "thanks for calling".
      assistantOverrides: { firstMessage: VAPI_OUTBOUND_GREETING },
    }),
  })
  const bodyText = await res.text()
  if (!res.ok) throw new Error(`Call failed: ${res.status} ${bodyText}`)

  let data = {}
  try { data = JSON.parse(bodyText) } catch { /* ignore */ }
  console.log('Outbound call started.')
  console.log(`From: ${fromNumber}`)
  console.log(`To:   ${TO}`)
  console.log(`Call id: ${data.id || '(see dashboard)'}`)
  console.log(`Status: ${data.status || 'queued'}`)
  console.log('Your phone should ring shortly; when you answer, the LOGIC voice bot will talk.')
}

main().catch((err) => {
  console.error('make-call failed:', err.message)
  process.exit(1)
})
