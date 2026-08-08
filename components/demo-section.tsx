'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, MessageCircle, Sparkles, CheckCircle, Zap, Clock, Shield, Brain } from 'lucide-react'

const industries = [
  {
    id: 'roofing',
    label: 'Roofing',
    domain: 'fundyroofing.ca',
    greeting: "Hi! You're on Fundy Roofing. What can I help you with?",
    training: [
      'Loading service catalog... 14 services',
      'Importing pricing matrix... $300-$15,000',
      'Mapping service area... Greater Saint John',
      'Training on emergency protocols...',
      'Loading seasonal availability...',
      'Indexing FAQ database... 47 entries',
      'Configuring lead qualification rules...',
      'Agent ready.',
    ],
    stats: { leads: 847, responseTime: '2.1s', afterHours: '63%', satisfaction: '94%' },
    activity: [
      { time: '9:47 PM', event: 'New lead captured', detail: 'Emergency leak repair', type: 'lead' },
      { time: '10:12 PM', event: 'Question answered', detail: 'Re-roof pricing inquiry', type: 'answer' },
      { time: '6:15 AM', event: 'Lead qualified as HOT', detail: 'Full replacement, ready now', type: 'hot' },
      { time: '11:33 PM', event: 'Appointment booked', detail: 'Free inspection Thursday', type: 'booking' },
      { time: '8:02 AM', event: 'Follow-up sent', detail: 'Estimate reminder email', type: 'followup' },
    ],
  },
  {
    id: 'dental',
    label: 'Dental',
    domain: 'rivervalleydental.ca',
    greeting: "Welcome to River Valley Dental! How can I help you today?",
    training: [
      'Loading treatment catalog... 22 procedures',
      'Importing fee schedule... $150-$5,000',
      'Configuring appointment types...',
      'Training on insurance FAQ...',
      'Loading provider availability...',
      'Indexing patient FAQ... 38 entries',
      'Setting up anxiety-sensitive responses...',
      'Agent ready.',
    ],
    stats: { leads: 1203, responseTime: '1.8s', afterHours: '71%', satisfaction: '97%' },
    activity: [
      { time: '8:45 PM', event: 'New patient inquiry', detail: 'Invisalign consultation', type: 'lead' },
      { time: '9:30 PM', event: 'Emergency triaged', detail: 'Tooth pain, same-day slot', type: 'hot' },
      { time: '6:02 AM', event: 'Appointment booked', detail: 'Cleaning + exam, new patient', type: 'booking' },
      { time: '10:15 PM', event: 'Question answered', detail: 'Insurance coverage query', type: 'answer' },
      { time: '7:20 AM', event: 'Reminder sent', detail: 'Upcoming appointment confirm', type: 'followup' },
    ],
  },
  {
    id: 'landscaping',
    label: 'Landscaping',
    domain: 'kvlandscaping.ca',
    greeting: "Hey! KV Landscaping here. What are you looking to get done?",
    training: [
      'Loading service menu... 18 services',
      'Importing seasonal pricing...',
      'Mapping coverage zone... KV area',
      'Training on material options...',
      'Loading crew availability...',
      'Indexing project gallery... 64 photos',
      'Configuring estimate calculator...',
      'Agent ready.',
    ],
    stats: { leads: 634, responseTime: '2.4s', afterHours: '58%', satisfaction: '92%' },
    activity: [
      { time: '9:14 PM', event: 'New lead captured', detail: 'Deck build, 12x16', type: 'lead' },
      { time: '10:30 PM', event: 'Estimate requested', detail: 'Retaining wall, 30ft', type: 'lead' },
      { time: '5:45 AM', event: 'Lead qualified as HOT', detail: 'Spring cleanup, ready to book', type: 'hot' },
      { time: '8:15 PM', event: 'Question answered', detail: 'Snow removal contract pricing', type: 'answer' },
      { time: '11:00 PM', event: 'Follow-up sent', detail: 'Deck quote follow-up', type: 'followup' },
    ],
  },
  {
    id: 'accounting',
    label: 'Accounting',
    domain: 'milleraccounting.ca',
    greeting: "Hello! Miller & Associates. What can I help you with?",
    training: [
      'Loading service offerings... 8 services',
      'Importing fee structure...',
      'Training on tax deadlines...',
      'Loading CRA compliance rules...',
      'Configuring client intake flow...',
      'Indexing FAQ... 52 entries',
      'Setting up qualification criteria...',
      'Agent ready.',
    ],
    stats: { leads: 412, responseTime: '1.9s', afterHours: '67%', satisfaction: '96%' },
    activity: [
      { time: '9:22 PM', event: 'New inquiry captured', detail: 'Corporate tax, new business', type: 'lead' },
      { time: '10:45 PM', event: 'Question answered', detail: 'HST filing deadline', type: 'answer' },
      { time: '6:30 AM', event: 'Consultation booked', detail: 'Discovery call, Tuesday', type: 'booking' },
      { time: '11:10 PM', event: 'Lead qualified as HOT', detail: 'Bookkeeping, immediate need', type: 'hot' },
      { time: '7:00 AM', event: 'Follow-up sent', detail: 'Document checklist email', type: 'followup' },
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export function DemoSection() {
  const [activeIndustry, setActiveIndustry] = useState<typeof industries[number] | null>(null)
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingStep, setTrainingStep] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const handleIndustryChange = (industry: typeof industries[number]) => {
    if (activeIndustry && industry.id === activeIndustry.id) return
    setMessages([])
    setInput('')
    setIsLoading(false)
    setIsTraining(true)
    setTrainingStep(0)
    setShowStats(false)
    setActiveIndustry(industry)

    // Animate through training steps
    const steps = industry.training.length
    let step = 0
    const interval = setInterval(() => {
      step++
      setTrainingStep(step)
      if (step >= steps) {
        clearInterval(interval)
        setTimeout(() => {
          setIsTraining(false)
          setShowStats(true)
        }, 400)
      }
    }, 280)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !activeIndustry) return

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
            Pick an industry. Watch the agent train. Then take over the conversation.
          </motion.p>
        </motion.div>

        {/* Industry selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {industries.map(ind => (
            <button
              key={ind.id}
              onClick={() => handleIndustryChange(ind)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeIndustry?.id === ind.id
                  ? 'bg-[#00d4ff] text-black'
                  : 'bg-[#1f1f2e] text-gray-400 hover:text-white hover:bg-[#2a2a3e]'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Browser frame */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-[#1f1f2e] overflow-hidden shadow-2xl shadow-[#00d4ff]/5 max-w-5xl mx-auto"
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
                {activeIndustry ? activeIndustry.domain : 'select an industry above'}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="bg-[#111118] flex flex-col md:flex-row min-h-[500px]">
            {/* Left panel: Idle / Training / Stats */}
            <div className="flex-1 p-5 md:p-6 hidden md:flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {!activeIndustry ? (
                  <IdleView key="idle" />
                ) : isTraining ? (
                  <TrainingView
                    key="training"
                    steps={activeIndustry.training}
                    currentStep={trainingStep}
                  />
                ) : (
                  <StatsView
                    key="stats"
                    stats={activeIndustry.stats}
                    activity={activeIndustry.activity}
                    show={showStats}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Chat panel (right side) */}
            <div className="w-full md:w-[320px] border-l border-[#1f1f2e] flex flex-col bg-[#0a0a0f]/50">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-[#1f1f2e] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {activeIndustry ? `${activeIndustry.label} Assistant` : 'AI Assistant'}
                  </p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeIndustry ? 'bg-green-500' : 'bg-gray-500'}`} />
                    {activeIndustry ? 'Online now' : 'Waiting for industry...'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[340px]">
                {!activeIndustry ? (
                  <div className="flex items-center justify-center h-full text-center px-4">
                    <p className="text-xs text-gray-500">Pick an industry above to activate the agent.</p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[#1f1f2e]">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={activeIndustry ? 'Type a message...' : 'Select an industry first...'}
                    className="flex-1 bg-[#1f1f2e] border border-[#2a2a3e] rounded-full px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                    disabled={isLoading || !activeIndustry}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || !activeIndustry}
                    className="w-7 h-7 rounded-full bg-[#00d4ff] text-black flex items-center justify-center disabled:opacity-40 transition flex-shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>

              {/* CTA */}
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

// --- Idle state before industry is picked ---
function IdleView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center text-center px-4"
    >
      <div className="w-16 h-16 rounded-full bg-[#1f1f2e] flex items-center justify-center mb-5 border border-[#2a2a3e]">
        <Brain className="w-8 h-8 text-[#00d4ff]/50" />
      </div>
      <p className="text-sm font-medium text-white mb-2">Choose an industry to deploy an agent</p>
      <p className="text-xs text-gray-500 max-w-[240px]">
        Select a business type above and watch the AI train in real time on that industry's data.
      </p>
      <div className="mt-6 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">Awaiting selection</span>
      </div>
    </motion.div>
  )
}

// --- Training animation view ---
function TrainingView({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-xs font-semibold text-white uppercase tracking-wider">Training Agent</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#1f1f2e] rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00d4ff]/60 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Training steps log */}
      <div className="flex-1 space-y-1.5 font-mono text-[11px] overflow-hidden">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: i < currentStep ? 1 : 0.2,
              x: 0,
            }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="flex items-center gap-2"
          >
            {i < currentStep ? (
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
            ) : i === currentStep ? (
              <Loader2 className="w-3 h-3 text-[#00d4ff] animate-spin flex-shrink-0" />
            ) : (
              <div className="w-3 h-3 rounded-full border border-[#2a2a3e] flex-shrink-0" />
            )}
            <span className={i < currentStep ? 'text-gray-300' : 'text-gray-600'}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Bottom glow effect during training */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
    </motion.div>
  )
}

// --- Stats + Activity view ---
function StatsView({
  stats,
  activity,
  show,
}: {
  stats: { leads: number; responseTime: string; afterHours: string; satisfaction: string }
  activity: { time: string; event: string; detail: string; type: string }[]
  show: boolean
}) {
  const [animatedLeads, setAnimatedLeads] = useState(0)

  useEffect(() => {
    if (!show) return
    let current = 0
    const target = stats.leads
    const increment = Math.ceil(target / 40)
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setAnimatedLeads(current)
    }, 30)
    return () => clearInterval(timer)
  }, [show, stats.leads])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard icon={Zap} label="Leads Captured" value={animatedLeads.toLocaleString()} />
        <StatCard icon={Clock} label="Avg Response" value={stats.responseTime} />
        <StatCard icon={Shield} label="After Hours" value={stats.afterHours} />
        <StatCard icon={Sparkles} label="Satisfaction" value={stats.satisfaction} />
      </div>

      {/* Activity feed */}
      <div className="flex-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Live Activity</p>
        <div className="space-y-1.5">
          {activity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-[#1f1f2e]/50 border border-[#2a2a3e]/50"
            >
              <ActivityDot type={item.type} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-200 truncate">{item.event}</p>
                <p className="text-[10px] text-gray-500 truncate">{item.detail}</p>
              </div>
              <span className="text-[10px] text-gray-600 flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#1f1f2e]/50 border border-[#2a2a3e]/50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-[#00d4ff]" />
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  )
}

function ActivityDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    lead: 'bg-[#00d4ff]',
    hot: 'bg-red-400',
    answer: 'bg-green-400',
    booking: 'bg-purple-400',
    followup: 'bg-yellow-400',
  }
  return (
    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[type] || 'bg-gray-500'}`} />
  )
}
