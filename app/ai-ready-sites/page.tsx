'use client'

import { motion } from 'framer-motion'
import { ArrowRight, AlertTriangle, CheckCircle, Code, Zap, Search, MessageSquare, FileText, Globe } from 'lucide-react'

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
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-20">
          <motion.p variants={fadeUp} className="text-[#00d4ff] text-sm font-semibold tracking-widest uppercase mb-4">
            The Full System
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Your AI agent is only as good<br />as the site it lives on.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Most small business websites weren't built to support AI. Thin content, missing pages, and poor structure mean your agent has nothing to work with. We fix that.
          </motion.p>
        </motion.div>

        {/* The Problem */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-6">The problem with most websites</motion.h2>
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="space-y-4">
              {[
                'No FAQ page. Your agent has nothing to quote when customers ask common questions.',
                'Services listed as bullet points with no detail. Not enough depth to train on.',
                'No pricing information anywhere. The agent has to say "I don\'t know" to the most common question.',
                'No service area page. Can\'t tell visitors whether you cover their town.',
                'Contact form with 8 fields. Friction that kills conversions before the agent can help.',
                'Built on a page builder with bloated code. Slow load times mean visitors leave before the agent even appears.',
              ].map((problem, i) => (
                <div key={i} className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-300 leading-relaxed">{problem}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-gray-500 mt-4">
            If this sounds like your site, an agent alone won't fix it. You need the foundation rebuilt.
          </motion.p>
        </motion.section>

        {/* What AI-Ready Means */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-6">What an AI-ready site looks like</motion.h2>
          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: FileText, title: 'Detailed service pages', desc: 'Every service has its own page with enough content for the agent to answer any question about it.' },
              { icon: MessageSquare, title: 'FAQ built for AI', desc: 'Structured questions and answers the agent can quote directly. Written to match how real customers ask.' },
              { icon: Globe, title: 'Clear service area', desc: 'Towns, regions, and boundaries spelled out so the agent never guesses about coverage.' },
              { icon: Search, title: 'SEO + AEO foundations', desc: 'Structured data, proper meta, and content architecture that ranks on Google and gets cited by AI search.' },
              { icon: Zap, title: 'Fast and lightweight', desc: 'Built in Next.js. No page builder bloat. Loads in under 2 seconds on any device.' },
              { icon: Code, title: 'Content structured for training', desc: 'Clean HTML hierarchy, logical sections, and clear language the AI can parse and learn from.' },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <item.icon className="w-5 h-5 text-[#00d4ff] mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* How It's Different */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-6">This isn't a website redesign</motion.h2>
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Typical web agency</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>"Pick a template"</li>
                  <li>Pretty design, thin content</li>
                  <li>No thought about what AI needs</li>
                  <li>WordPress + 40 plugins</li>
                  <li>Contact form and a phone number</li>
                  <li>$3K-$8K, takes 3 months</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00d4ff] uppercase tracking-wider mb-3">FundyLogic AI-Ready Build</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>Content-first architecture</li>
                  <li>Every page designed to train your agent</li>
                  <li>FAQ, pricing, services structured for AI</li>
                  <li>Next.js, fast, no bloat</li>
                  <li>AI agent deployed on day one</li>
                  <li>$8K-$12K, live in 3-4 weeks</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* What You Get */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-6">What's included</motion.h2>
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="space-y-4">
              {[
                'Discovery call to understand your business, services, and customers',
                'Content strategy and writing (we write it, you approve it)',
                'Custom Next.js website: fast, responsive, SEO-optimized',
                'Service pages with AI-trainable depth',
                'FAQ page structured for agent quoting',
                'Pricing/process page (transparent, not hidden)',
                'Service area page with specific towns and regions',
                'JSON-LD structured data for AI search visibility',
                'Custom AI chat agent trained on the new content',
                'Lead capture with email notifications',
                '30 days of agent tuning after launch',
                'You own everything. Code, content, domain, hosting.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Timeline */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-6">Timeline</motion.h2>
          <motion.div variants={fadeUp} className="space-y-4">
            {[
              { week: 'Week 1', title: 'Discovery + Strategy', desc: 'We learn your business, map your services, identify your customers\' top questions.' },
              { week: 'Week 2', title: 'Content + Design', desc: 'We write the content, design the site structure, get your approval.' },
              { week: 'Week 3', title: 'Build + Agent Training', desc: 'Site goes live. Agent gets trained on the new content. Testing begins.' },
              { week: 'Week 4', title: 'Launch + Tuning', desc: 'Everything deployed. Agent tuning based on real conversations. You start getting leads.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-16 text-xs font-bold text-[#00d4ff] pt-1">{step.week}</div>
                <div className="glass-card rounded-xl p-4 flex-1">
                  <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-8 sm:p-10 border-[#00d4ff]/20 glow-cyan">
            <h2 className="text-2xl font-bold text-white mb-3">Not sure if your site is ready?</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              Run our free assessment. It will tell you exactly what's missing and whether you need the full build or just an agent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/analyze" className="px-6 py-3 rounded-lg bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition text-sm">
                Analyze Your Website Free
              </a>
              <a href="/#contact" className="px-6 py-3 rounded-lg border border-[#1f1f2e] text-gray-300 font-medium hover:border-[#00d4ff]/50 hover:text-white transition text-sm">
                Or book a call directly
              </a>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}
