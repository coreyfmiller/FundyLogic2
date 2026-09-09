/**
 * Import a Twilio phone number into Vapi and attach it to the voice assistant.
 * Dependency-free (plain node). Bypasses the Vapi web dashboard entirely.
 *
 * This single call registers the number, stores the Twilio credentials, and sets the
 * inbound assistant, so calls to the number are answered by the FundyLogic voice bot.
 * The same number is then usable as caller ID for outbound calls.
 *
 * Usage:  npm run import-number
 * Requires in .env.local:
 *   VAPI_PRIVATE_KEY        (already set)
 *   VAPI_ASSISTANT_ID       (already set)
 *   TWILIO_ACCOUNT_SID      (AC... from console.twilio.com home -> Account Info)
 *   TWILIO_AUTH_TOKEN       (secret, from the same panel; NEVER commit or paste in chat)
 *   VAPI_PHONE_NUMBER       (optional; defaults to +15063155111)
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

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

async function main() {
  const e = loadEnvLocal()
  const KEY = process.env.VAPI_PRIVATE_KEY || e.VAPI_PRIVATE_KEY
  const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || e.VAPI_ASSISTANT_ID
  const SID = process.env.TWILIO_ACCOUNT_SID || e.TWILIO_ACCOUNT_SID
  const TOKEN = process.env.TWILIO_AUTH_TOKEN || e.TWILIO_AUTH_TOKEN
  const NUMBER = process.env.VAPI_PHONE_NUMBER || e.VAPI_PHONE_NUMBER || '+15063155111'

  const missing = []
  if (!KEY) missing.push('VAPI_PRIVATE_KEY')
  if (!ASSISTANT_ID) missing.push('VAPI_ASSISTANT_ID')
  if (!SID) missing.push('TWILIO_ACCOUNT_SID')
  if (!TOKEN) missing.push('TWILIO_AUTH_TOKEN')
  if (missing.length) throw new Error(`Missing in .env.local: ${missing.join(', ')}`)

  const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

  const res = await fetch(`${BASE}/phone-number`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      provider: 'twilio',
      number: NUMBER,
      twilioAccountSid: SID,
      twilioAuthToken: TOKEN,
      assistantId: ASSISTANT_ID,
    }),
  })

  const bodyText = await res.text()
  if (!res.ok) throw new Error(`Import failed: ${res.status} ${bodyText}`)

  let data = {}
  try { data = JSON.parse(bodyText) } catch { /* ignore */ }
  console.log('Phone number imported and attached to the assistant.')
  console.log(`Number: ${NUMBER}`)
  console.log(`Vapi phone-number id: ${data.id || '(see dashboard)'}`)
  console.log(`Inbound assistant: ${ASSISTANT_ID}`)
  console.log('Inbound calls will now be answered by the FundyLogic voice bot.')
}

main().catch((err) => {
  console.error('import-number failed:', err.message)
  process.exit(1)
})
