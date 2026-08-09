'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, MessageCircle, Zap, CheckCircle } from 'lucide-react'
import Image from 'next/image'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const showcaseSites = [
  {
    name: 'Atlantic Plumbing & Heating',
    industry: 'Plumbing & HVAC',
    image: '/showcase/atlantic-plumbing.png',
    url: 'https://atlantic-plumbing.vercel.app',
    agentHandles: ['Emergency call booking', 'Service area questions', 'Appointment scheduling'],
  },
  {
    name: 'Summit Roofing NB',
    industry: 'Roofing',
    image: '/showcase/summit-roofing.png',
    url: 'https://summit-roofing-ten.vercel.app',
    agentHandles: ['Storm damage inquiries', 'Free inspection booking', 'Material questions'],
  },
  {
    name: 'Spark Electric',
    industry: 'Electrical',
    image: '/showcase/spark-electric.png',
    url: 'https://spark-electric-blue.vercel.app',
    agentHandles: ['EV charger questions', 'Panel upgrade quotes', '24/7 emergency routing'],
  },
  {
    name: 'Greenstone Landscaping',
    industry: 'Landscaping',
    image: '/showcase/greenstone.png',
    url: 'https://greenstone-rho.vercel.app',
    agentHandles: ['Seasonal service pricing', 'Project scope questions', 'Estimate scheduling'],
  },
  {
    name: 'Pristine Auto Detailing',
    industry: 'Auto Detailing',
    image: '/showcase/pristine.png',
    url: 'https://pristine-chi.vercel.app',
    agentHandles: ['Package comparisons', 'Mobile service availability', 'Booking requests'],
  },
  {
    name: 'Crystal Clear Cleaning',
    industry: 'Cleaning Services',
    image: '/showcase/crystal-clear.png',
    url: 'https://crystal-clear-olive.vercel.app',
    agentHandles: ['Recurring plan questions', 'Instant quote requests', 'Service area coverage'],
  },
]

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

      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-16">
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Websites built for AI. Not just for looks.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl mx-auto text-lg">
            Every site below was built to support a live AI agent. The content is structured for training. The pages answer real questions. The agent works because the site gives it something to work with.
          </motion.p>
        </motion.div>

        {/* Showcase Grid */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {showcaseSites.map(site => (
            <motion.a
              key={site.name}
              variants={fadeUp}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card rounded-2xl overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-300"
            >
              {/* Screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={site.image}
                  alt={`${site.name} website`}
                  width={800}
                  height={500}
                  className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent opacity-60" />
                <span className="absolute top-3 right-3 text-[10px] font-medium text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {site.industry}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#00d4ff] transition">{site.name}</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00d4ff] transition" />
                </div>
                <div className="space-y-1.5">
                  {site.agentHandles.map((handle, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                      <MessageCircle className="w-3 h-3 text-[#00d4ff]/50" />
                      {handle}
                    </div>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* What makes these different */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white text-center mb-10">
            What makes these sites different
          </motion.h2>
          <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: MessageCircle, title: 'Built to train AI', desc: 'Every page is structured so an agent can learn from it. FAQ, services, pricing, process. All written for machine comprehension.' },
              { icon: Zap, title: 'Fast by default', desc: 'Next.js. No WordPress. No page builders. Sub-2-second load times. The agent appears before visitors get impatient.' },
              { icon: CheckCircle, title: 'Agent-ready on day one', desc: 'The AI agent ships with the site. Not bolted on later. They are designed as one system from the start.' },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center">
                <item.icon className="w-6 h-6 text-[#00d4ff] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* What's included */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16">
          <motion.h2 variants={fadeUp} className="text-xl font-bold text-white mb-5">Every AI-ready build includes:</motion.h2>
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Custom Next.js website',
                'Content written for AI training',
                'Service pages with real depth',
                'FAQ your agent can quote directly',
                'SEO + AI search visibility',
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
          <p className="text-xs text-gray-600 mt-3">$8,000 - $12,000. Live in 3-4 weeks. One-time build.</p>
        </motion.div>

        {/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="glass-card rounded-2xl p-8 sm:p-10 border-[#00d4ff]/20 glow-cyan text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Want this for your business?</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-lg mx-auto">
              Tell us what you do. We'll show you what your site and agent would look like.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/#contact" className="px-6 py-3 rounded-lg bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition text-sm inline-flex items-center gap-2">
                Book a Discovery Call <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/analyze" className="px-6 py-3 rounded-lg border border-[#1f1f2e] text-gray-300 font-medium hover:border-[#00d4ff]/50 hover:text-white transition text-sm">
                Or analyze your current site free
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
