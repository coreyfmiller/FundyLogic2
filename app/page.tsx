'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Mic, Workflow, ArrowRight, ChevronDown, Zap, Clock, Users, Rocket } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DemoSection } from '@/components/demo-section'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Home() {
  return (
    <div className="bg-grid">
      <Navbar />
      <Hero />
      <SocialProof />
      <Services />
      <HowItWorks />
      <DemoSection />
      <Stats />
      <RecentWork />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-[#1f1f2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="FundyLogic" className="h-8" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#services" className="hover:text-white transition">Services</a>
          <a href="#work" className="hover:text-white transition">Work</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="/blog" className="hover:text-white transition">Blog</a>
          <a href="/analyze" className="hover:text-white transition">Free Audit</a>
        </div>
        <a href="#contact" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-black text-sm font-semibold hover:bg-[#00b8e6] transition">
          Book a Call <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </nav>
  )
}

function Hero() {
  const phrases = ['Sleep', 'Drive to the job site', 'Coach your kid\'s hockey', 'Take a weekend off', 'Focus on real work', 'Close other deals']
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [bootLine, setBootLine] = useState(0)

  const bootSequence = [
    '> Initializing FundyLogic...',
    '> Loading conversation engine...',
    '> Connecting lead capture...',
    '> Deploying AI agents...',
    '> System online.',
  ]

  // Check if user has seen boot before
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('bootSeen')) {
      setBootComplete(true)
      return
    }

    let line = 0
    const interval = setInterval(() => {
      line++
      setBootLine(line)
      if (line >= bootSequence.length) {
        clearInterval(interval)
        setTimeout(() => {
          setBootComplete(true)
          sessionStorage.setItem('bootSeen', '1')
        }, 800)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!bootComplete) return
    const currentPhrase = phrases[phraseIndex]

    if (!isDeleting && displayText === currentPhrase) {
      const timer = setTimeout(() => setIsDeleting(true), 2500)
      return () => clearTimeout(timer)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const speed = isDeleting ? 40 : 80
    const timer = setTimeout(() => {
      setDisplayText(prev =>
        isDeleting ? prev.slice(0, -1) : currentPhrase.slice(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, phraseIndex, phrases, bootComplete])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Gradient orb background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00d4ff]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#00d4ff]/3 blur-[80px] pointer-events-none" />

      {/* Boot sequence overlay */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a0f]"
          >
            <div className="font-mono text-sm space-y-2 px-6 max-w-md">
              {bootSequence.slice(0, bootLine).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={i === bootSequence.length - 1 && bootLine >= bootSequence.length ? 'text-[#00d4ff]' : 'text-[#00d4ff]/60'}
                >
                  {line}
                </motion.p>
              ))}
              {bootLine < bootSequence.length && (
                <p className="text-[#00d4ff]">
                  <span className="animate-pulse">▊</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main hero content */}
      {bootComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
        >
          <p className="text-[#00d4ff] text-sm font-semibold tracking-widest uppercase mb-6">
            AI Agents for Small Business
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            AI That Works While You<br />
            <span className="text-[#00d4ff] glow-text">
              {displayText}
              <span className="inline-block w-[3px] h-[0.9em] bg-[#00d4ff] ml-1 animate-pulse align-middle" />
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Custom-built AI agents that live on your website. They answer questions, qualify leads, and follow up automatically. You wake up to booked calls.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#demo" className="px-8 py-4 rounded-lg bg-[#00d4ff] text-black font-bold text-lg hover:bg-[#00b8e6] transition shadow-lg shadow-[#00d4ff]/20">
              See It in Action
            </a>
            <a href="/analyze" className="px-8 py-4 rounded-lg border border-[#1f1f2e] text-gray-300 font-semibold hover:border-[#00d4ff]/50 hover:text-white transition">
              Analyze Your Website Free
            </a>
          </div>
          <div className="mt-16">
            <ChevronDown className="w-6 h-6 text-gray-600 mx-auto animate-bounce" />
          </div>
        </motion.div>
      )}
    </section>
  )
}

function HeroChat() {
  const [visibleMessages, setVisibleMessages] = useState(0)

  const conversation = [
    { role: 'agent', text: "Hi! Welcome to Fundy Roofing. How can I help you today?" },
    { role: 'visitor', text: "Do you do emergency leak repairs in Saint John?" },
    { role: 'agent', text: "We do, 24/7 across greater Saint John. Is the leak active right now?" },
    { role: 'visitor', text: "Yes, dripping into the kitchen." },
    { role: 'agent', text: "Understood. I can get a crew out tonight between 7-9pm. What number should they text on the way?" },
    { role: 'visitor', text: "506-555-0142" },
    { role: 'agent', text: "Got it. Someone will text you within 30 minutes to confirm. Hang tight!" },
  ]

  useEffect(() => {
    if (visibleMessages >= conversation.length) return
    const delay = visibleMessages === 0 ? 1000 : (conversation[visibleMessages - 1].role === 'agent' ? 1800 : 1200)
    const timer = setTimeout(() => setVisibleMessages(v => v + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleMessages, conversation.length])

  // Restart loop
  useEffect(() => {
    if (visibleMessages >= conversation.length) {
      const timer = setTimeout(() => setVisibleMessages(0), 5000)
      return () => clearTimeout(timer)
    }
  }, [visibleMessages, conversation.length])

  return (
    <div className="w-full max-w-[340px] ml-auto rounded-2xl border border-[#1f1f2e] overflow-hidden shadow-2xl shadow-[#00d4ff]/5 bg-[#111118]">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-[#1f1f2e] flex items-center gap-2 bg-[#0a0a0f]">
        <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5 text-[#00d4ff]" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Fundy Assistant</p>
          <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Online now
          </p>
        </div>
        <span className="ml-auto text-[9px] text-gray-600 bg-[#1f1f2e] px-2 py-0.5 rounded">9:47 PM</span>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2 min-h-[280px] max-h-[320px] overflow-hidden">
        {conversation.slice(0, visibleMessages).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'visitor' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
              msg.role === 'visitor'
                ? 'bg-[#00d4ff] text-black rounded-br-sm'
                : 'bg-[#1f1f2e] text-gray-200 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {visibleMessages < conversation.length && visibleMessages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex ${conversation[visibleMessages].role === 'visitor' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="rounded-2xl px-3.5 py-2 bg-[#1f1f2e] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-[#0a0a0f] rounded-full border border-[#1f1f2e] px-3.5 py-2">
          <span className="text-xs text-gray-600 flex-1">Type a message...</span>
          <div className="w-6 h-6 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-[#00d4ff]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialProof() {
  return (
    <section className="py-12 border-y border-[#1f1f2e]">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide">Trusted by businesses across Atlantic Canada</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-gray-500 text-sm font-medium">
          <span>Duelly.io</span>
          <span>KV Adventure Club</span>
          <span>Clean Cut Crew</span>
          <span>Donovan Home Solutions</span>
          <span>Sunrise Seedlings</span>
        </div>
      </div>
    </section>
  )
}

function Services() {
  const services = [
    {
      icon: MessageSquare,
      title: 'AI Chat Agents',
      description: 'A custom-trained chat widget that greets visitors, answers questions in your voice, captures leads, and sends them to you qualified. Runs 24/7.',
      tag: 'Most Popular',
    },
    {
      icon: Mic,
      title: 'AI Voice Agents',
      description: 'An AI that answers your phone, handles common questions, books appointments, and escalates to you only when needed. Never miss a call.',
      tag: null,
    },
    {
      icon: Workflow,
      title: 'AI Automation',
      description: 'Connect your tools with intelligent workflows. New lead to CRM to welcome email to follow-up, all automated with AI making the decisions.',
      tag: null,
    },
  ]

  return (
    <section id="services" className="py-24 md:py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">What We Build</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto">Every agent is custom-trained on your business. No templates, no generic bots.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              className="glass-card rounded-2xl p-8 hover:border-[#00d4ff]/30 transition-all duration-300 group relative"
            >
              {service.tag && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full">
                  {service.tag}
                </span>
              )}
              <service.icon className="w-10 h-10 text-[#00d4ff] mb-5 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'We learn your business', description: 'A quick discovery call where we understand your services, common questions, ideal customers, and how you want leads handled.' },
    { number: '02', title: 'We build and train your agent', description: 'We create your AI agent, train it on your content, test it thoroughly, and embed it on your site. Usually done in under two weeks.' },
    { number: '03', title: 'You get leads while you sleep', description: 'Your agent works around the clock. You get qualified leads in your inbox, booked calls on your calendar, and monthly performance reports.' },
  ]

  return (
    <section className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400">Three steps. Two weeks. Done.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-12"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={fadeUp} className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] font-bold text-sm">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  const stats = [
    { icon: Clock, value: '24/7', label: 'Availability' },
    { icon: Users, value: '3x', label: 'More Leads Captured' },
    { icon: Zap, value: '<2 weeks', label: 'Delivery Time' },
    { icon: Rocket, value: '100%', label: 'Custom Built' },
  ]

  return (
    <section className="py-20 border-t border-[#1f1f2e]">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <stat.icon className="w-6 h-6 text-[#00d4ff] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function RecentWork() {
  const projects = [
    { name: 'Duelly.io', description: 'AI search visibility SaaS', result: 'Full product build, Stripe integration, live customers' },
    { name: 'KV Adventure Club', description: 'Kids subscription service', result: 'AI chatbot handling parent inquiries 24/7' },
    { name: 'Clean Cut Crew', description: 'Lawn care service', result: 'Lead capture agent with booking automation' },
    { name: 'Donovan Home Solutions', description: 'Home services', result: 'AI-powered quote request system' },
  ]

  return (
    <section id="work" className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">Recent Work</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400">Real builds. Real results.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={fadeUp} className="glass-card rounded-xl p-6 hover:border-[#00d4ff]/20 transition">
              <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{project.description}</p>
              <p className="text-sm text-[#00d4ff]">{project.result}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    { name: 'Jordan Kessler', role: 'Founder, MarketMojo.ai', content: 'FundyLogic took our concept and turned it into a fully functional SaaS platform in record time. We went from idea to paying customers in weeks, not months.', location: 'Toronto, ON' },
    { name: 'Nate Holloway', role: 'Co-Founder, Duelly.ai', content: 'We needed a technical partner who could build a complex audit engine with real-time AI analysis, and FundyLogic delivered beyond expectations.', location: 'Vancouver, BC' },
    { name: 'Ron Miller', role: 'RP Miller Consulting', content: 'FundyLogic built a custom AI chatbot that handles client inquiries 24/7. It qualifies leads and answers tax questions while I focus on billable work.', location: 'Lakeville Corner, NB' },
  ]

  return (
    <section className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">What Clients Say</motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <motion.div key={t.name} variants={fadeUp} className="glass-card rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed mb-6">"{t.content}"</p>
              <div>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role} · {t.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Pricing() {
  const tiers = [
    {
      name: 'Agent Only',
      price: '$2,500 - $5,500',
      description: 'Your site is solid. We deploy an AI agent on it.',
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
      price: '$8,000 - $12,000',
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

  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple Pricing</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto">Every build is custom. Here is where most projects land.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tiers.map(tier => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={`glass-card rounded-2xl p-8 flex flex-col ${tier.highlight ? 'border-[#00d4ff]/30 glow-cyan' : ''}`}
            >
              <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{tier.description}</p>
              <div className="text-3xl font-bold text-white mb-6">{tier.price}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Zap className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`w-full py-3.5 rounded-lg font-semibold text-center transition ${
                  tier.highlight
                    ? 'bg-[#00d4ff] text-black hover:bg-[#00b8e6]'
                    : 'bg-[#1f1f2e] text-white hover:bg-[#2a2a3e]'
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center text-xs text-gray-600 mt-6">
          One-time build. You own everything. No monthly lock-in required.
        </motion.p>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    { q: 'How long does it take to build an AI agent?', a: 'Most projects are live within 1-2 weeks from our first call. Complex builds with multiple integrations may take 3-4 weeks.' },
    { q: 'Do I need technical knowledge?', a: 'None. We handle everything from design to deployment. You just answer our questions about your business during the discovery phase.' },
    { q: 'What if the AI says something wrong?', a: 'We train it specifically on your content with guardrails. It only answers what it knows. For edge cases, it gracefully hands off to you.' },
    { q: 'Will it work on my existing website?', a: 'Yes. Our agents embed as a chat widget on any website, any platform. WordPress, Shopify, Squarespace, custom builds, it all works.' },
    { q: 'What are the ongoing costs?', a: 'The build is a one-time fee. Ongoing AI usage (API costs) is typically $20-50/month depending on traffic. We offer optional support plans for ongoing tuning.' },
    { q: 'Can it integrate with my CRM or email?', a: 'Yes. We connect to most tools: HubSpot, Mailchimp, Google Sheets, Calendly, Slack, and more. If it has an API, we can wire it up.' },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">Questions</motion.h2>
          <motion.div variants={fadeUp} className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-white font-medium hover:text-[#00d4ff] transition"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CTA() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', company: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">Ready to put AI to work?</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-10 text-center">Tell us about your business. We will get back to you within 24 hours.</motion.p>
          <motion.div variants={fadeUp}>
            {status === 'sent' ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <p className="text-2xl mb-2">✓</p>
                <p className="text-lg font-semibold text-white">Message sent!</p>
                <p className="text-gray-400 mt-2">We will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#1f1f2e] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                  />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#1f1f2e] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                  />
                </div>
                <input
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Company / Website (optional)"
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#1f1f2e] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                />
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what you need..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#1f1f2e] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition resize-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 rounded-lg bg-[#00d4ff] text-black font-bold text-lg hover:bg-[#00b8e6] transition disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Try again or email info@fundylogic.com.</p>}
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 border-t border-[#1f1f2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="FundyLogic" className="h-6" />
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#services" className="hover:text-white transition">Services</a>
          <a href="#work" className="hover:text-white transition">Work</a>
          <a href="/blog" className="hover:text-white transition">Blog</a>
          <a href="/analyze" className="hover:text-white transition">Free Audit</a>
        </div>
        <p className="text-sm text-gray-600">Built in New Brunswick, Canada</p>
      </div>
    </footer>
  )
}
