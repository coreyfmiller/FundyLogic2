'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, MessageCircle, Zap, CheckCircle, Send, Loader2, X } from 'lucide-react'

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
    showcaseId: 'atlantic-plumbing',
    greeting: "Hi! Welcome to Atlantic Plumbing & Heating. Got a question about plumbing or heating? I'm here to help.",
    agentHandles: ['Emergency call booking', 'Service area questions', 'Appointment scheduling'],
  },
  {
    name: 'Summit Roofing NB',
    industry: 'Roofing',
    image: '/showcase/summit-roofing.png',
    url: 'https://summit-roofing-ten.vercel.app',
    showcaseId: 'summit-roofing',
    greeting: "Hey there! Summit Roofing here. Whether it's storm damage or a full re-roof, ask me anything.",
    agentHandles: ['Storm damage inquiries', 'Free inspection booking', 'Material questions'],
  },
  {
    name: 'Spark Electric',
    industry: 'Electrical',
    image: '/showcase/spark-electric.png',
    url: 'https://spark-electric-blue.vercel.app',
    showcaseId: 'spark-electric',
    greeting: "Hi! Spark Electric here. From panel upgrades to EV chargers, what can I help you with?",
    agentHandles: ['EV charger questions', 'Panel upgrade quotes', '24/7 emergency routing'],
  },
  {
    name: 'Greenstone Landscaping',
    industry: 'Landscaping',
    image: '/showcase/greenstone.png',
    url: 'https://greenstone-rho.vercel.app',
    showcaseId: 'greenstone-landscaping',
    greeting: "Hey! Greenstone Landscaping. Thinking about your yard? Ask me about anything from lawn care to patios.",
    agentHandles: ['Seasonal service pricing', 'Project scope questions', 'Estimate scheduling'],
  },
  {
    name: 'Pristine Auto Detailing',
    industry: 'Auto Detailing',
    image: '/showcase/pristine.png',
    url: 'https://pristine-chi.vercel.app',
    showcaseId: 'pristine-detailing',
    greeting: "Welcome to Pristine! Looking to get your vehicle detailed? I can help with packages and booking.",
    agentHandles: ['Package comparisons', 'Mobile service availability', 'Booking requests'],
  },
  {
    name: 'Crystal Clear Cleaning',
    industry: 'Cleaning Services',
    image: '/showcase/crystal-clear.png',
    url: 'https://crystal-clear-olive.vercel.app',
    showcaseId: 'crystal-clear',
    greeting: "Hi! Crystal Clear Cleaning here. Need a clean home or office? Ask me about services or booking.",
    agentHandles: ['Recurring plan questions', 'Instant quote requests', 'Service area coverage'],
  },
]

export default function AIReadySitesPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const activeSite = showcaseSites.find(s => s.showcaseId === activeChatId)

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const openChat = (showcaseId: string) => {
    setActiveChatId(showcaseId)
    setMessages([])
    setInput('')
    setTimeout(() => chatInputRef.current?.focus(), 100)
  }

  const closeChat = () => {
    setActiveChatId(null)
    setMessages([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !activeChatId) return

    const userMsg = { role: 'user', content: input, id: crypto.randomUUID() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, showcaseId: activeChatId }),
      })

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Having trouble connecting. Try again.', id: crypto.randomUUID() }])
        setIsLoading(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      const botMsgId = crypto.randomUUID()
      setMessages(prev => [...prev, { role: 'assistant', content: '', id: botMsgId }])

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const text = decoder.decode(value, { stream: true })
        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: m.content + text } : m))
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong.', id: crypto.randomUUID() }])
    } finally {
      setIsLoading(false)
    }
  }
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
            Websites built for AI.<br className="hidden sm:block" /> Looks are just a bonus.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl mx-auto text-lg">
            These sites are designed to look great AND power an AI agent. The content is structured for training. The pages answer real questions. The agent works because the site gives it something to work with.
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
                <img
                  src={site.image}
                  alt={`${site.name} website`}
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
                <div className="space-y-1.5 mb-4">
                  {site.agentHandles.map((handle, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                      <MessageCircle className="w-3 h-3 text-[#00d4ff]/50" />
                      {handle}
                    </div>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); openChat(site.showcaseId) }}
                  className="w-full py-2 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium hover:bg-[#00d4ff]/20 transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3 h-3" /> Chat with this agent
                </button>
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

        {/* Floating chat panel */}
        <AnimatePresence>
          {activeChatId && activeSite && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[380px] h-[480px] flex flex-col rounded-2xl overflow-hidden border border-[#1f1f2e] shadow-2xl shadow-[#00d4ff]/10 bg-[#111118]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e] bg-[#0a0a0f]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                    <MessageCircle className="w-3.5 h-3.5 text-[#00d4ff]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{activeSite.name}</p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                    </p>
                  </div>
                </div>
                <button onClick={closeChat} className="text-gray-500 hover:text-white transition p-1" aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed bg-[#1f1f2e] text-gray-200 rounded-bl-sm">
                    {activeSite.greeting}
                  </div>
                </div>
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#00d4ff] text-black rounded-br-sm'
                        : 'bg-[#1f1f2e] text-gray-200 rounded-bl-sm'
                    }`}>
                      {m.role === 'user' ? m.content : (
                        <span dangerouslySetInnerHTML={{
                          __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                        }} />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-3.5 py-2.5 bg-[#1f1f2e] flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin text-[#00d4ff]" />
                      <span className="text-[10px] text-gray-500">Typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[#1f1f2e]">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    ref={chatInputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask as a customer would..."
                    className="flex-1 bg-[#1f1f2e] border border-[#2a2a3e] rounded-full px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-7 h-7 rounded-full bg-[#00d4ff] text-black flex items-center justify-center disabled:opacity-30 transition flex-shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
