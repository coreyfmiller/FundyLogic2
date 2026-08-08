'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, MessageCircle, Sparkles } from 'lucide-react'

const industries = [
  { id: 'roofing', label: 'Roofing', domain: 'fundyroofing.ca', greeting: "Hi! You're on Fundy Roofing. What can I help you with?" },
  { id: 'dental', label: 'Dental', domain: 'rivervalleydental.ca', greeting: "Welcome to River Valley Dental! How can I help you today?" },
  { id: 'landscaping', label: 'Landscaping', domain: 'kvlandscaping.ca', greeting: "Hey! KV Landscaping here. What are you looking to get done?" },
  { id: 'accounting', label: 'Accounting', domain: 'milleraccounting.ca', greeting: "Hello! Miller & Associates. What can I help you with?" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export function DemoSection() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0])
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  // Reset chat when industry changes
  const handleIndustryChange = (industry: typeof industries[number]) => {
    setActiveIndustry(industry)
    setMessages([])
    setInput('')
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = { role: 'user', content: input, id: crypto.randomUUID() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, industry: activeIndustry.id }),
      })

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, having trouble connecting. Try again in a moment.',
          id: crypto.randomUUID()
        }])
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
        setMessages(prev =>
          prev.map(m => m.id === botMsgId ? { ...m, content: m.content + text } : m)
        )
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        id: crypto.randomUUID()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-[#1f1f2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Try it yourself.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto">
            This is a real AI agent running on a mock business site. Pick an industry, then take over the chat.
          </motion.p>
        </motion.div>

        {/* Industry selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {industries.map(ind => (
            <button
              key={ind.id}
              onClick={() => handleIndustryChange(ind)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeIndustry.id === ind.id
                  ? 'bg-[#00d4ff] text-black'
                  : 'bg-[#1f1f2e] text-gray-400 hover:text-white hover:bg-[#2a2a3e]'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Browser frame with chat */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-[#1f1f2e] overflow-hidden shadow-2xl shadow-[#00d4ff]/5 max-w-4xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="bg-[#0a0a0f] border-b border-[#1f1f2e] px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-[#1f1f2e] rounded-lg px-4 py-1.5 text-xs text-gray-400 min-w-[200px] text-center">
                {activeIndustry.domain}
              </div>
            </div>
          </div>

          {/* Mock website + chat layout */}
          <div className="bg-[#111118] flex flex-col md:flex-row min-h-[480px]">
            {/* Mock website content (left side) */}
            <div className="flex-1 p-6 md:p-8 hidden md:block">
              <div className="space-y-4">
                {/* Mock nav */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-[#1f1f2e] rounded" />
                  <div className="flex gap-4">
                    <div className="h-3 w-12 bg-[#1f1f2e] rounded" />
                    <div className="h-3 w-12 bg-[#1f1f2e] rounded" />
                    <div className="h-3 w-16 bg-[#00d4ff]/20 rounded" />
                  </div>
                </div>
                {/* Mock hero */}
                <div className="mt-8 space-y-3">
                  <div className="h-6 w-3/4 bg-[#1f1f2e] rounded" />
                  <div className="h-6 w-1/2 bg-[#1f1f2e] rounded" />
                  <div className="h-4 w-full bg-[#1f1f2e]/50 rounded mt-4" />
                  <div className="h-4 w-5/6 bg-[#1f1f2e]/50 rounded" />
                </div>
                {/* Mock CTA */}
                <div className="flex gap-3 mt-6">
                  <div className="h-10 w-28 bg-[#00d4ff]/20 rounded-lg" />
                  <div className="h-10 w-28 bg-[#1f1f2e] rounded-lg" />
                </div>
                {/* Mock cards */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="h-20 bg-[#1f1f2e]/50 rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-[#1f1f2e] mb-2" />
                    <div className="h-2 w-16 bg-[#1f1f2e] rounded" />
                  </div>
                  <div className="h-20 bg-[#1f1f2e]/50 rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-[#1f1f2e] mb-2" />
                    <div className="h-2 w-14 bg-[#1f1f2e] rounded" />
                  </div>
                  <div className="h-20 bg-[#1f1f2e]/50 rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-[#1f1f2e] mb-2" />
                    <div className="h-2 w-12 bg-[#1f1f2e] rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat panel (right side) */}
            <div className="w-full md:w-[320px] border-l border-[#1f1f2e] flex flex-col bg-[#0a0a0f]/50">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-[#1f1f2e] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{activeIndustry.label} Assistant</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Online now
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[340px]">
                {/* Greeting */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed bg-[#1f1f2e] text-gray-200 rounded-bl-sm">
                    {activeIndustry.greeting}
                  </div>
                </div>
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#00d4ff] text-black rounded-br-sm'
                        : 'bg-[#1f1f2e] text-gray-200 rounded-bl-sm'
                    }`}>
                      {m.role === 'user' ? m.content : (
                        <span dangerouslySetInnerHTML={{
                          __html: m.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }} />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-3 py-2 bg-[#1f1f2e] flex items-center gap-1.5">
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
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#1f1f2e] border border-[#2a2a3e] rounded-full px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-7 h-7 rounded-full bg-[#00d4ff] text-black flex items-center justify-center disabled:opacity-40 transition flex-shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>

              {/* Take over CTA */}
              <div className="px-3 pb-3">
                <a
                  href="#contact"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#00d4ff] text-black text-xs font-semibold hover:bg-[#00b8e6] transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get one for your business
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
