'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, MessageCircle, Sparkles, CheckCircle, Brain, ArrowRight, Terminal } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

function generateTrainingSteps(businessInput: string): string[] {
  const input = businessInput.trim()
  const locationMatch = input.match(/\bin\s+(.+)$/i)
  const location = locationMatch ? locationMatch[1] : 'your area'
  const businessType = locationMatch ? input.replace(locationMatch[0], '').trim() : input

  return [
    `Analyzing ${businessType} industry patterns...`,
    'Identifying common customer questions...',
    'Loading typical service offerings...',
    `Mapping ${location} service area...`,
    'Configuring lead qualification logic...',
    'Building objection handling...',
    'Setting response guardrails...',
    'Training conversation model...',
    'Running test scenarios...',
    'Agent deployed.',
  ]
}

export function DemoSection() {
  const [businessInput, setBusinessInput] = useState('')
  const [isDeployed, setIsDeployed] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingSteps, setTrainingSteps] = useState<string[]>([])
  const [trainingStep, setTrainingStep] = useState(0)
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessInput.trim() || (isTraining && !isDeployed)) return

    const steps = generateTrainingSteps(businessInput)
    setTrainingSteps(steps)
    setTrainingStep(0)
    setIsTraining(true)
    setIsDeployed(false)
    setMessages([])

    let step = 0
    const interval = setInterval(() => {
      step++
      setTrainingStep(step)
      if (step >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setIsDeployed(true)
          chatInputRef.current?.focus()
        }, 300)
      }
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !isDeployed) return

    const userMsg = { role: 'user', content: input, id: crypto.randomUUID() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, businessType: businessInput }),
      })

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Having trouble connecting. Try again in a moment.',
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

  const greeting = `Hi! I'm the AI assistant for your ${businessInput.trim()}. Ask me anything a customer would ask.`

  return (
    <section id="demo" className="py-20 md:py-28 border-t border-[#1f1f2e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-6"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-2">
            See it in action.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 text-sm sm:text-base">
            Enter your business type. Watch an agent deploy. Then chat with it.
          </motion.p>
        </motion.div>

        {/* Demo Frame */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-700 ${
            isDeployed ? 'border-[#00d4ff]/30 shadow-[#00d4ff]/10' : 'border-[#1f1f2e] shadow-[#00d4ff]/5'
          }`}
        >
          {/* Deploy bar */}
          <div className="bg-[#0a0a0f] border-b border-[#1f1f2e] px-3 sm:px-5 py-3">
            <form onSubmit={handleDeploy} className="flex items-center gap-2 sm:gap-3">
              <Terminal className="w-4 h-4 text-gray-600 flex-shrink-0 hidden sm:block" />
              <input
                value={businessInput}
                onChange={e => setBusinessInput(e.target.value)}
                placeholder="What kind of business do you run?"
                className="flex-1 bg-[#1f1f2e] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00d4ff]/50 transition"
                disabled={isTraining && !isDeployed}
              />
              <button
                type="submit"
                disabled={!businessInput.trim() || (isTraining && !isDeployed)}
                className="px-4 sm:px-5 py-2.5 rounded-lg bg-[#00d4ff] text-black text-xs sm:text-sm font-semibold hover:bg-[#00b8e6] transition disabled:opacity-30 flex items-center gap-1.5 flex-shrink-0"
              >
                <span className="hidden sm:inline">Deploy</span> Agent <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Content area */}
          <div className="bg-[#111118] flex flex-col md:flex-row min-h-[460px]">
            {/* Left: Terminal */}
            <div className="flex-1 p-4 md:p-5 flex flex-col overflow-hidden border-b md:border-b-0 md:border-r border-[#1f1f2e]">
              <AnimatePresence mode="wait">
                {isTraining || isDeployed ? (
                  <TrainingTerminal key="training" steps={trainingSteps} currentStep={trainingStep} />
                ) : (
                  <IdleTerminal key="idle" />
                )}
              </AnimatePresence>
            </div>

            {/* Right: Chat */}
            <div className="w-full md:w-[320px] lg:w-[340px] flex flex-col bg-[#0a0a0f]/40">
              {/* Chat header */}
              <div className="px-4 py-2.5 border-b border-[#1f1f2e] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">AI Agent</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    {isDeployed ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online</>
                    ) : isTraining ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Training...</>
                    ) : (
                      <><span className="w-1.5 h-1.5 rounded-full bg-gray-600" /> Offline</>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[280px] max-h-[340px]">
                {!isTraining && !isDeployed ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[11px] text-gray-600 text-center px-6">
                      Enter your business type above and deploy an agent to start chatting.
                    </p>
                  </div>
                ) : !isDeployed ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-5 h-5 text-[#00d4ff] animate-spin mx-auto mb-2" />
                      <p className="text-[11px] text-gray-500">Training your agent...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-start">
                      <div className="max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed bg-[#1f1f2e] text-gray-200 rounded-bl-sm">
                        {greeting}
                      </div>
                    </div>
                    {messages.map(m => (
                      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
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
                        <div className="rounded-2xl px-3.5 py-2.5 bg-[#1f1f2e] flex items-center gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin text-[#00d4ff]" />
                          <span className="text-[10px] text-gray-500">Typing...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-3 border-t border-[#1f1f2e]">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    ref={chatInputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={isDeployed ? 'Ask as a customer would...' : 'Deploy an agent first...'}
                    className="flex-1 bg-[#1f1f2e] border border-[#2a2a3e] rounded-full px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                    disabled={isLoading || !isDeployed}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || !isDeployed}
                    className="w-7 h-7 rounded-full bg-[#00d4ff] text-black flex items-center justify-center disabled:opacity-30 transition flex-shrink-0"
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
                  Let's customize yours
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-gray-600 mt-4 max-w-lg mx-auto">
          This is a general demo. Your actual agent gets trained on your real services, pricing, hours, and policies so every answer is specific to your business.
        </p>
      </div>
    </section>
  )
}

// --- Idle Terminal ---
function IdleTerminal() {
  const lines = [
    '> FundyLogic Agent Framework v2.4.1',
    '> Conversation engine .......... loaded',
    '> Lead qualification model ..... ready',
    '> Response guardrails .......... active',
    '> NLP pipeline ................. initialized',
    '> Knowledge base ............... empty',
    '> Service area ................. not set',
    '',
    '> STATUS: Awaiting deployment',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-[11px] font-semibold text-[#00d4ff] uppercase tracking-wider">Agent Terminal</span>
      </div>
      <div className="flex-1 bg-[#0a0a0f] rounded-xl border border-[#1f1f2e] p-4 font-mono text-[11px] leading-relaxed overflow-hidden">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: line ? 0.6 : 0 }}
            transition={{ duration: 0.2, delay: i * 0.06 }}
            className={line.includes('STATUS') ? 'text-[#00d4ff] mt-2' : 'text-[#00d4ff]/40'}
          >
            {line || '\u00A0'}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-3 text-[#00d4ff]"
        >
          $ <span className="animate-pulse">▊</span>
        </motion.p>
      </div>
    </motion.div>
  )
}

// --- Training Terminal ---
function TrainingTerminal({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  const isComplete = currentStep >= steps.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
          {isComplete ? 'Agent Live' : 'Deploying Agent'}
        </span>
        {isComplete && (
          <span className="ml-auto text-[10px] text-[#00d4ff] font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Ready
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#1f1f2e] rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / steps.length) * 100}%`,
            backgroundColor: '#00d4ff',
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Log */}
      <div className="flex-1 bg-[#0a0a0f] rounded-xl border border-[#1f1f2e] p-4 font-mono text-[11px] overflow-hidden">
        <div className="space-y-1.5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{
                opacity: i < currentStep ? 1 : i === currentStep ? 0.6 : 0.12,
                x: 0,
              }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-2"
            >
              {i < currentStep ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#00d4ff] flex-shrink-0 mt-px" />
              ) : i === currentStep ? (
                <Loader2 className="w-3.5 h-3.5 text-[#00d4ff] animate-spin flex-shrink-0 mt-px" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-[#2a2a3e] flex-shrink-0 mt-px" />
              )}
              <span className={
                i < currentStep ? 'text-gray-300' : i === currentStep ? 'text-[#00d4ff]' : 'text-gray-700'
              }>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 pt-3 border-t border-[#1f1f2e]"
          >
            <p className="text-[#00d4ff]">
              <span className="text-gray-600">$</span> Agent online. Ready for visitors.
              <span className="animate-pulse ml-1">▊</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
