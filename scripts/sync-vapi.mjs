/**
 * Push the version-controlled voice prompt to the Vapi assistant. Dependency-free (plain node).
 *
 * Vapi is an external service and cannot import our code, so this keeps the live voice bot in
 * sync with the repo. It reads VAPI_VOICE_PROMPT from lib/vapi-voice-prompt.mjs (source of truth)
 * and PATCHes it onto the assistant via the Vapi API.
 *
 * Usage:  npm run sync-vapi
 * Requires in .env.local:  VAPI_PRIVATE_KEY, VAPI_ASSISTANT_ID
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { VAPI_VOICE_PROMPT, VAPI_INBOUND_GREETING } from '../lib/vapi-voice-prompt.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://api.vapi.ai'
// Where Vapi POSTs end-of-call reports (the deployed webhook route).
const WEBHOOK_URL = process.env.VAPI_WEBHOOK_URL || 'https://fundylogic.com/api/vapi-webhook'
// The voice bot LLM. claude-3-5-sonnet-20240620 is deprecated (retires 2025-10-28);
// claude-sonnet-4-5 is the current recommended Anthropic Sonnet on Vapi.
const MODEL_PROVIDER = 'anthropic'
const MODEL_NAME = 'claude-sonnet-4-5-20250929'

// Minimal .env.local parser (avoids a dotenv dependency).
function loadEnvLocal() {
  const env = {}
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const k = trimmed.slice(0, eq).trim()
      let v = trimmed.slice(eq + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      env[k] = v
    }
  } catch {
    // no .env.local; fall back to process.env
  }
  return env
}

async function main() {
  const fileEnv = loadEnvLocal()
  const KEY = process.env.VAPI_PRIVATE_KEY || fileEnv.VAPI_PRIVATE_KEY
  const ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || fileEnv.VAPI_ASSISTANT_ID

  if (!KEY) throw new Error('VAPI_PRIVATE_KEY is not set (add it to .env.local)')
  if (!ASSISTANT_ID) throw new Error('VAPI_ASSISTANT_ID is not set (add it to .env.local)')

  const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

  // 1. Read current assistant so we preserve its model provider/model and only swap the prompt.
  const getRes = await fetch(`${BASE}/assistant/${ASSISTANT_ID}`, { headers })
  if (!getRes.ok) throw new Error(`GET assistant failed: ${getRes.status} ${await getRes.text()}`)
  const assistant = await getRes.json()

  // Pin to the current model (upgrades off the deprecated claude-3-5-sonnet-20240620).
  const provider = MODEL_PROVIDER
  const model = MODEL_NAME
  const nonSystem = (assistant?.model?.messages ?? []).filter((m) => m.role !== 'system')
  const messages = [{ role: 'system', content: VAPI_VOICE_PROMPT }, ...nonSystem]

  // 2. PATCH the model block plus the inbound greeting and sensible call controls.
  //    (Outbound calls override firstMessage per-call in make-call.mjs.)
  const patchRes = await fetch(`${BASE}/assistant/${ASSISTANT_ID}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      model: { provider, model, messages },
      firstMessage: VAPI_INBOUND_GREETING,
      endCallPhrases: ['goodbye', 'bye now', 'have a good one', 'talk soon', 'take care'],
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 600,
      // Send end-of-call reports to our webhook so voice leads get emailed to us.
      server: { url: WEBHOOK_URL },
      serverMessages: ['end-of-call-report'],
      // Auto-generate a summary and a structured lead object for every call.
      analysisPlan: {
        summaryPlan: {
          messages: [
            { role: 'system', content: 'You summarize a sales discovery phone call in 3 to 5 sentences: who they are, their business, the pain we uncovered, what they are interested in (website / agent / software), and the agreed next step.' },
            { role: 'user', content: 'Summarize this call:\n\n{{transcript}}' },
          ],
        },
        structuredDataPlan: {
          enabled: true,
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Caller name' },
              businessName: { type: 'string' },
              businessType: { type: 'string', description: 'What the business does / industry' },
              websiteSituation: { type: 'string', description: 'Do they have a site, how old, how it performs' },
              currentLeadHandling: { type: 'string', description: 'How they handle calls/leads now, what is missed' },
              biggestPain: { type: 'string' },
              interestedIn: { type: 'string', description: 'website, agent, software, or not sure' },
              decisionMaker: { type: 'string', description: 'yes, no, or unknown' },
              timeline: { type: 'string', description: 'soon, exploring, or unknown' },
              bestContact: { type: 'string', description: 'phone and/or email captured' },
              leadRating: { type: 'string', description: 'hot, warm, or cold' },
            },
          },
        },
      },
    }),
  })
  if (!patchRes.ok) throw new Error(`PATCH assistant failed: ${patchRes.status} ${await patchRes.text()}`)

  console.log('Vapi voice assistant updated successfully.')
  console.log(`Assistant: ${ASSISTANT_ID}`)
  console.log(`Model: ${provider}/${model}`)
  console.log(`Prompt length: ${VAPI_VOICE_PROMPT.length} chars`)
  console.log(`Inbound greeting: "${VAPI_INBOUND_GREETING}"`)
}

main().catch((err) => {
  console.error('sync-vapi failed:', err.message)
  process.exit(1)
})
