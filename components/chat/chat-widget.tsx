'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Phone, PhoneOff, Mic } from 'lucide-react'

const VAPI_PUBLIC_KEY = 'f959921e-19ce-4608-9ea8-ff3f5f4c0df5'
const ASSISTANT_ID = 'baecb1f5-dc14-4640-8fce-51473731c446'

type Mode = 'closed' | 'choose' | 'chat' | 'voice'
type VoiceStatus = 'idle' | 'connecting' | 'active' | 'ended'

export function ChatWidget() {
  const [mode, setMode] = useState<Mode>('closed')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const vapiRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (vapiRef.current) {
        try { vapiRef.current.stop() } catch {}
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // --- Chat ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = { role: 'user', content: input, id: crypto.randomUUID() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble right now. Try again or email info@fundylogic.com.',
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

  const handleClose = () => {
    if (messages.length > 1) {
      fetch('/api/chat-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      }).catch(() => {})
    }
    setMode('closed')
  }

  // --- Voice ---
  const startVoiceCall = async () => {
    setVoiceStatus('connecting')
    setMode('voice')

    try {
      const { default: Vapi } = await import('@vapi-ai/web')
      const vapi = new Vapi(VAPI_PUBLIC_KEY)
      vapiRef.current = vapi

      vapi.on('call-start', () => {
        setVoiceStatus('active')
        setDuration(0)
        intervalRef.current = setInterval(() => setDuration(d => d + 1), 1000)
      })

      vapi.on('call-end', () => {
        setVoiceStatus('ended')
        if (intervalRef.current) clearInterval(intervalRef.current)
        setTimeout(() => {
          setVoiceStatus('idle')
          setMode('closed')
        }, 3000)
      })

      vapi.on('error', () => {
        setVoiceStatus('idle')
        if (intervalRef.current) clearInterval(intervalRef.current)
      })

      await vapi.start(ASSISTANT_ID)
    } catch (err) {
      console.error('Vapi error:', err)
      setVoiceStatus('idle')
      setMode('choose')
    }
  }

  const endVoiceCall = () => {
    if (vapiRef.current) vapiRef.current.stop()
  }

  const toggleMute = () => {
    if (vapiRef.current) {
      const newMuted = !isMuted
      vapiRef.current.setMuted(newMuted)
      setIsMuted(newMuted)
    }
  }

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // --- CLOSED ---
  if (mode === 'closed') {
    return (
      <button
        onClick={() => setMode('choose')}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#00d4ff] text-black font-semibold shadow-lg shadow-[#00d4ff]/20 hover:scale-105 transition-all"
        aria-label="Open chat or voice assistant"
      >
        <MessageCircle className="w-5 h-5" />
        Ask LOGIC
      </button>
    )
  }

  // --- CHOOSE MODE ---
  if (mode === 'choose') {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-[300px] rounded-2xl border border-[#1f1f2e] bg-[#111118] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e] bg-[#0a0a0f]">
          <p className="text-sm font-semibold text-white">Talk to LOGIC</p>
          <button onClick={() => setMode('closed')} className="text-gray-500 hover:text-white transition p-1" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={() => setMode('chat')}
            className="w-full flex items-center gap-3 rounded-xl border border-[#1f1f2e] p-3 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Text Chat</p>
              <p className="text-[11px] text-gray-500">Type your questions</p>
            </div>
          </button>
          <button
            onClick={startVoiceCall}
            className="w-full flex items-center gap-3 rounded-xl border border-[#1f1f2e] p-3 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/5 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Voice Call</p>
              <p className="text-[11px] text-gray-500">Speak with our AI</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // --- VOICE MODE ---
  if (mode === 'voice') {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-[300px] rounded-2xl border border-[#1f1f2e] bg-[#111118] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e] bg-[#0a0a0f]">
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#00d4ff]" />
            Voice Call
          </p>
          {voiceStatus !== 'active' && (
            <button
              onClick={() => { endVoiceCall(); setMode('closed') }}
              className="text-gray-500 hover:text-white transition p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-8 flex flex-col items-center gap-4">
          {voiceStatus === 'connecting' && (
            <>
              <Loader2 className="w-8 h-8 text-[#00d4ff] animate-spin" />
              <p className="text-sm text-gray-400">Connecting...</p>
            </>
          )}
          {voiceStatus === 'active' && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-lg font-medium text-white">{formatDuration(duration)}</span>
              </div>
              <p className="text-xs text-gray-500">Speaking with LOGIC</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={toggleMute}
                  className={`rounded-full p-3 transition-colors ${
                    isMuted ? 'bg-red-500/20 text-red-400' : 'bg-[#1f1f2e] text-white hover:bg-[#2a2a3e]'
                  }`}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={endVoiceCall}
                  className="rounded-full bg-red-500 p-3 text-white hover:bg-red-600 transition-colors"
                  aria-label="End call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
          {voiceStatus === 'ended' && (
            <p className="text-sm text-gray-400">Call ended. Thanks for chatting!</p>
          )}
        </div>
      </div>
    )
  }

  // --- CHAT MODE ---
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[520px] flex flex-col rounded-2xl overflow-hidden border border-[#1f1f2e] shadow-2xl bg-[#111118]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e] bg-[#0a0a0f]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode('choose')}
            className="text-gray-500 hover:text-white transition text-xs"
            aria-label="Back to options"
          >
            ←
          </button>
          <div className="w-8 h-8 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">LOGIC</p>
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <button onClick={handleClose} className="text-gray-500 hover:text-white transition p-1" aria-label="Close chat">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-12 text-sm text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#1f1f2e] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#00d4ff]" />
            </div>
            <p className="font-medium text-white mb-1">Hey there</p>
            <p>I'm LOGIC. Ask me anything about AI agents, pricing, or how we can help your business.</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#00d4ff] text-black rounded-br-sm'
                : 'bg-[#1f1f2e] text-gray-200 rounded-bl-sm'
            }`}>
              {m.role === 'user' ? m.content : (
                <div dangerouslySetInnerHTML={{
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
            <div className="rounded-2xl px-4 py-3 bg-[#1f1f2e] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#00d4ff]" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#1f1f2e]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[#0a0a0f] rounded-full border border-[#1f1f2e] px-4 py-1 focus-within:border-[#00d4ff]/50 transition">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-gray-600 py-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-full bg-[#00d4ff] text-black flex items-center justify-center disabled:opacity-40 transition"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
