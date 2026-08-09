'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function AIReadySitesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid">
      <nav className="border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FundyLogic" className="h-8" />
          </a>
          <a href="/#contact" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-black text-sm font-semibold hover:bg-[#00b8e6] transition">
            Book a Call <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-16">
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Your agent needs a site worth talking about.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto">
            An AI agent trained on thin content gives thin answers. We build the site and the agent together so they work as one system.
          </motion.p>
        </motion.div>

        {/* Comparison */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16">
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">Typical website</h3>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>Template design, generic content</li>
                  <li>No FAQ, no pricing, no service detail</li>
                  <li>Built for looks, not for AI</li>
                  <li>WordPress + plugins, slow to load</li>
                  <li>Agent has nothing to train on</li>
                  <li>Contact form and hope for the best</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00d4ff] uppercase tracking-wider mb-4">AI-Ready build</h3>
                <ul className="space-y-2.5 text-sm text-gray-200">
                  <li>Content-first, structured for AI</li>
                  <li>FAQ, pricing, services, area pages</li>
                  <li>Every page trains your agent</li>
                  <li>Next.js, loads in under 2 seconds</li>
                  <li>Agent deployed with deep knowledge</li>
                  <li>Conversations, not forms</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* What's included */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16">
          <motion.h2 variants={fadeUp} className="text-xl font-bold text-white mb-5">What you get</motion.h2>
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Custom Next.js website',
                'Content written for AI training',
                'Service pages with real depth',
                'FAQ structured for agent quoting',
                'SEO + structured data built in',
                'AI chat agent deployed on launch',
                'Lead capture + notifications',
                'You own everything. No lock-in.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-xs text-gray-600 mt-3">$8,000 - $12,000. Live in 3-4 weeks.</p>
        </motion.div>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
          <div className="glass-card rounded-2xl p-8 border-[#00d4ff]/20 glow-cyan">
            <h2 className="text-xl font-bold text-white mb-2">Not sure if your site is ready?</h2>
            <p className="text-sm text-gray-400 mb-6">Run our free assessment. Takes 30 seconds.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/analyze" className="px-6 py-3 rounded-lg bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition text-sm">
                Analyze Your Website
              </a>
              <a href="/#contact" className="px-6 py-3 rounded-lg border border-[#1f1f2e] text-gray-300 font-medium hover:border-[#00d4ff]/50 hover:text-white transition text-sm">
                Book a call instead
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
