'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, MessageCircle, Sparkles, CheckCircle, Brain, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

function generateTrainingSteps(businessInput: string): string[] {
  // Parse out business type and location if possible
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessInput.trim() || isTraining) return

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
          inputRef.current?.focus()
        }, 300)
      }
    }, 320)
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

  const greeting = isDeployed
    ? `Hi! I'm your AI assistant. I'm here to help customers of your ${businessInput.trim()}. Go ahead and ask me something a customer might ask.`
    : ''

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
            See it in action.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-lg mx-auto">
            Tell us what you do. We'll deploy a custom AI agent for your business in seconds.
          </motion.p>
        </motion.div>

        {/* Business input */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleDeploy} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                value={businessInput}
                onChange={e => setBusinessInput(e.target.value)}
                placeholder="e.g. plumbing company in Moncton"
                className="w-full bg-[#111118] border border-[#1f1f2e] rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                disabled={isTraining && !isDeployed}
              />
            </div>
            <button
              type="submit"
              disabled={!businessInput.trim() || (isTraining && !isDeployed)}
              className="px-5 py-3.5 rounded-xl bg-[#00d4ff] text-black text-sm font-semibold hover:bg-[#00b8e6] transition disabled:opacity-40 flex items-center gap-2 flex-shrink-0"
            >
              Deploy Agent <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Browser frame - appears on deploy */}
        <AnimatePresence>
          {(isTraining || isDeployed) && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
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
                  <div className="bg-[#1f1f2e] rounded-lg px-4 py-1.5 text-xs text-gray-400 min-w-[220px] text-center">
                    your-business.com
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="bg-[#111118] flex flex-col md:flex-row min-h-[500px]">
                {/* Left: Training terminal */}
                <div className="flex-1 p-5 md:p-6 hidden md:flex flex-col overflow-hidden">
                  <TrainingTerminal steps={trainingSteps} currentStep={trainingStep} />
                </div>

                {/* Right: Chat */}
                <div className="w-full md:w-[340px] border-l border-[#1f1f2e] flex flex-col bg-[#0a0a0f]/50">
                  {/* Chat header */}
                  <div className="px-4 py-3 border-b border-[#1f1f2e] flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-[#00d4ff]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Your AI Agent</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isDeployed ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                        {isDeployed ? 'Online' : 'Deploying...'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[340px]">
                    {!isDeployed ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center px-4">
                          <Loader2 className="w-5 h-5 text-[#00d4ff] animate-spin mx-auto mb-2" />
                          <p className="text-[11px] text-gray-500">Training your agent...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed bg-[#1f1f2e] text-gray-200 rounded-bl-sm">
                            {greeting}
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
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={isDeployed ? 'Ask something a customer would ask...' : 'Agent deploying...'}
                        className="flex-1 bg-[#1f1f2e] border border-[#2a2a3e] rounded-full px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                        disabled={isLoading || !isDeployed}
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !input.trim() || !isDeployed}
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
                      Get the real thing for your business
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// --- Training Terminal ---
function TrainingTerminal({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-[#00d4ff]" />
        <span className="text-xs font-semibold text-white uppercase tracking-wider">Deploying Agent</span>
        {currentStep >= steps.length && (
          <span className="ml-auto text-[10px] text-green-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Live
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#1f1f2e] rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / steps.length) * 100}%`,
            backgroundColor: currentStep >= steps.length ? '#22c55e' : '#00d4ff',
          }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {/* Terminal log */}
      <div className="flex-1 bg-[#0a0a0f] rounded-xl border border-[#1f1f2e] p-4 font-mono text-[11px] overflow-hidden">
        <div className="space-y-2">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{
                opacity: i < currentStep ? 1 : i === currentStep ? 0.6 : 0.15,
                x: 0,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              {i < currentStep ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : i === currentStep ? (
                <Loader2 className="w-3.5 h-3.5 text-[#00d4ff] animate-spin flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-[#2a2a3e] flex-shrink-0 mt-0.5" />
              )}
              <span className={`leading-tight ${
                i < currentStep ? 'text-gray-300' : i === currentStep ? 'text-[#00d4ff]' : 'text-gray-700'
              }`}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Blinking cursor at bottom after complete */}
        {currentStep >= steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-3 border-t border-[#1f1f2e]"
          >
            <p className="text-green-400 flex items-center gap-1">
              <span className="text-gray-600">$</span> Agent online. Waiting for visitor...
              <span className="animate-pulse">▊</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
