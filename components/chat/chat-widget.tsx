'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble right now. Try again or email info@fundylogic.com.', id: crypto.randomUUID() }])
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.', id: crypto.randomUUID() }])
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
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#00d4ff] text-black font-semibold shadow-lg shadow-[#00d4ff]/20 hover:scale-105 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        Ask LOGIC
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[520px] flex flex-col rounded-2xl overflow-hidden border border-[#1f1f2e] shadow-2xl bg-[#111118]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f2e] bg-[#0a0a0f]">
        <div className="flex items-center gap-3">
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
        <button onClick={handleClose} className="text-gray-500 hover:text-white transition p-1">
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
            <p className="font-medium text-white mb-1">Hey there 👋</p>
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
                <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
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
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
