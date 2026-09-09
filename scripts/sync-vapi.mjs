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
import { VAPI_VOICE_PROMPT } from '../lib/vapi-voice-prompt.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://api.vapi.ai'

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

  const provider = assistant?.model?.provider ?? 'anthropic'
  const model = assistant?.model?.model ?? 'claude-3-5-sonnet-20240620'
  const nonSystem = (assistant?.model?.messages ?? []).filter((m) => m.role !== 'system')
  const messages = [{ role: 'system', content: VAPI_VOICE_PROMPT }, ...nonSystem]

  // 2. PATCH just the model block.
  const patchRes = await fetch(`${BASE}/assistant/${ASSISTANT_ID}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ model: { provider, model, messages } }),
  })
  if (!patchRes.ok) throw new Error(`PATCH assistant failed: ${patchRes.status} ${await patchRes.text()}`)

  console.log('Vapi voice prompt updated successfully.')
  console.log(`Assistant: ${ASSISTANT_ID}`)
  console.log(`Model: ${provider}/${model}`)
  console.log(`Prompt length: ${VAPI_VOICE_PROMPT.length} chars`)
}

main().catch((err) => {
  console.error('sync-vapi failed:', err.message)
  process.exit(1)
})
