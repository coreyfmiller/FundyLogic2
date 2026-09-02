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

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Agent Only',
    price: 'Starting at $5,000',
    description: 'Your site is solid. We deploy a premium, custom AI agent on it.',
    features: [
      'Custom AI agent trained on your business',
      'Installed on your existing website',
      'Lead capture + email notifications',
      'Voice agent option available',
      '30 days of tuning included',
      'Optional monthly support plan',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Agent + AI-Ready Site',
    price: 'Starting at $10,000',
    description: 'We rebuild your site for AI, then deploy the agent on top.',
    features: [
      'Everything in Agent Only',
      'Full website rebuild (Next.js)',
      'Content structured for AI training',
      'SEO + AEO foundations built in',
      'FAQ, services, and pricing pages optimized',
      'The agent and the site work as one system',
    ],
    cta: 'Book a Discovery Call',
    highlight: true,
  },
]

// Short pricing summary reused in prose spots (e.g. the ai-ready-sites page footnote).
export const AI_READY_SITE_PRICE_NOTE = 'Starting at $10,000. Live in 3-4 weeks. One-time build.'

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
- Agent Only: starting at $5,000. We deploy a premium custom AI agent on your existing site.
- Agent + AI-Ready Site: starting at $10,000. We rebuild your site for AI, then deploy the agent on top.
- SaaS / larger custom platforms: scoped per project, typically $15,000+.
Every build is custom and premium, so these are starting points, not fixed quotes. Offer to book a discovery call for an exact number.

CONTACT: ${CONTACT.email} or the contact form on our site.`
