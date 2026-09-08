/**
 * SINGLE SOURCE OF TRUTH for FundyLogic business facts (pricing, services, contact).
 *
 * Anything the website AND the bots need to agree on lives here. The pricing section,
 * the ai-ready-sites page, and the chat bot's system prompt all read from this file, so
 * a change here updates the whole site at once.
 *
 * !!! IMPORTANT: The Vapi VOICE bot is external and CANNOT import this file. !!!
 * After changing pricing or services here, you MUST also update the Vapi assistant's
 * system prompt in the Vapi dashboard (assistant id baecb1f5-dc14-4640-8fce-51473731c446).
 * The bot system prompt below (BOT_SYSTEM_FACTS) is the exact text to paste into Vapi.
 */

export const CONTACT = {
  email: 'info@fundylogic.com',
  location: 'Quispamsis, New Brunswick',
}

export type PricingTier = {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  highlight: boolean
}

// NOTE: Public pricing numbers were intentionally removed. FundyLogic quotes every
// project on a discovery call (custom, premium, one-time builds). Keep it numberless
// on the site AND in both bots. If fixed pricing is ever reintroduced, restore a
// PricingTier[] here and update BOT_SYSTEM_FACTS + the Vapi voice bot to match.
export const PRICING_TIERS: PricingTier[] = []

// Short pricing summary reused in prose spots (e.g. the ai-ready-sites page footnote).
export const AI_READY_SITE_PRICE_NOTE = 'Custom quoted. Live in 3-4 weeks. One-time build, you own everything.'

/**
 * The canonical facts block injected into the CHAT bot's system prompt.
 * Keep this in sync with PRICING_TIERS above. Paste this same block into the Vapi VOICE bot too.
 */
export const BOT_SYSTEM_FACTS = `WHAT WE BUILD:

1. AI AGENTS (chat + voice):
- AI Chat Agents: Custom-trained chat widgets, answer questions 24/7, capture leads
- AI Voice Agents: Answer the phone, handle common questions, book appointments
- AI Lead Qualifiers, follow-up sequences, and internal knowledge bots

2. AI-READY WEBSITES:
- Modern Next.js sites structured so AI agents can read and recommend the business

3. AI-POWERED SAAS and INTEGRATIONS:
- Full platform builds and adding AI to existing systems
- Examples: Duelly (AI search visibility), MarketMojo (AI prospecting)

PRICING (premium, one-time builds; you own everything, no monthly lock-in required):
- We do NOT publish fixed prices. Every build (a website, an AI agent, or both) is custom, so it is quoted per project.
- Do NOT invent, estimate, or quote specific dollar amounts. If asked "how much," explain that pricing depends on scope and that we give an exact number on a quick, free discovery call, then offer to book one.
- What shapes the quote: whether they need a website, an agent, or both; the size of the site; integrations; and how much content/training is involved.

CONTACT: ${CONTACT.email} or the contact form on our site.`
