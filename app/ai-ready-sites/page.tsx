'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
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

      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* The Pain */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-20">
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">
            Your website is open 24 hours.<br />
            <span className="text-gray-500">After 5pm, it's a brochure nobody reads.</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="space-y-5 text-gray-400 leading-relaxed">
            <p>
              It's a Tuesday night. 9:14 PM. Someone in your area needs exactly what you offer. They pull out their phone. They Google it. They find your site.
            </p>
            <p>
              They see a homepage with a stock photo. A list of services with no detail. A phone number they're not going to call at 9 PM. A contact form that feels like shouting into a void.
            </p>
            <p>
              They hit the back button. They click the next result. They find someone who answers their question immediately.
            </p>
            <p className="text-white font-medium">
              You never knew they were there. No notification. No missed call. Just revenue that walked out the door while you were watching TV.
            </p>
          </motion.div>
        </motion.div>

        {/* The Shift */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-8">
            Same person. Same Tuesday night.<br />
            <span className="text-[#00d4ff]">Different site.</span>
          </motion.h2>

          <motion.div variants={fadeUp} className="space-y-5 text-gray-400 leading-relaxed">
            <p>
              They land on a site that's fast. Clean. Every service has its own page with real information. There's a chat in the corner. Not aggressive, just there.
            </p>
            <p>
              They type: "Do you handle emergency calls in Rothesay?"
            </p>
            <p>
              Three seconds later, the agent responds. Yes, emergency calls are available. What's the situation? Can I get your number so someone can call you within 15 minutes?
            </p>
            <p className="text-white font-medium">
              By 9:17 PM, you have a name, a phone number, and a job description in your inbox. You call them first thing Wednesday morning. They're relieved someone responded so fast. You book the job.
            </p>
            <p>
              The difference wasn't a better agent. It was a better site. The agent could answer because the site had content worth answering from.
            </p>
          </motion.div>
        </motion.div>

        {/* The Point */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white mb-6">
            An AI agent is only as smart as the site it lives on.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-8">
            We don't build websites for the sake of building websites. We build the foundation your agent needs to actually perform. Content structured for AI. Pages that answer real questions. A site that loads fast and gets out of the way.
          </motion.p>

          {/* Comparison */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">What you probably have</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>Generic template, thin content</li>
                  <li>No FAQ, no real service detail</li>
                  <li>Contact form as the only option</li>
                  <li>Agent has nothing to train on</li>
                  <li>Visitors leave with unanswered questions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#00d4ff] uppercase tracking-wider mb-3">What we build</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>Content-first, structured for AI</li>
                  <li>FAQ, services, pricing, area pages</li>
                  <li>Conversations, not forms</li>
                  <li>Agent deployed with deep knowledge</li>
                  <li>Visitors get answers at 9 PM on a Tuesday</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* What's Included */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16">
          <motion.h2 variants={fadeUp} className="text-xl font-bold text-white mb-5">The full system includes:</motion.h2>
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Custom Next.js website (fast, no bloat)',
                'Content written and structured for AI',
                'Service pages with trainable depth',
                'FAQ your agent can quote directly',
                'SEO + AI search visibility built in',
                'AI chat agent deployed on launch',
                'Lead capture + email notifications',
                'You own everything. No lock-in.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-xs text-gray-600 mt-3">$8,000 - $12,000. Live in 3-4 weeks. One-time build.</p>
        </motion.div>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="glass-card rounded-2xl p-8 border-[#00d4ff]/20 glow-cyan text-center">
            <h2 className="text-xl font-bold text-white mb-2">Find out if your site is holding you back.</h2>
            <p className="text-sm text-gray-400 mb-6">Our free assessment crawls your site and tells you exactly what's missing.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/analyze" className="px-6 py-3 rounded-lg bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition text-sm">
                Analyze Your Website Free
              </a>
              <a href="/#contact" className="px-6 py-3 rounded-lg border border-[#1f1f2e] text-gray-300 font-medium hover:border-[#00d4ff]/50 hover:text-white transition text-sm">
                Skip ahead, book a call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
