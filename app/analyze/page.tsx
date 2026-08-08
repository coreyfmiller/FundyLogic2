'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, Globe, Shield, Zap, ArrowRight, AlertCircle } from 'lucide-react'

interface Analysis {
  url: string
  title: string
  description: string
  platform: string
  hasSSL: boolean
  analysis: {
    businessName: string
    businessType: string
    score: number
    missingElements: string[]
    aiAgentOpportunities: string[]
    sampleConversation: string
    estimatedLeadsLost: string
    recommendation: string
  } | null
  error?: string
}

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` }),
      })
      const data = await res.json()
      if (data.error && !data.analysis) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid">
      {/* Nav */}
      <nav className="border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FundyLogic" className="h-8" />
          </a>
          <a href="/#contact" className="text-sm text-gray-400 hover:text-white transition">Back to Home</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Free AI Agent Assessment</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Paste your website URL. In 30 seconds, see exactly how an AI agent would work on your site, what leads you are missing, and a sample conversation.
          </p>
        </motion.div>

        {/* Input */}
        <form onSubmit={handleAnalyze} className="mb-12">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-3 bg-[#111118] border border-[#1f1f2e] rounded-xl px-4 py-3 focus-within:border-[#00d4ff]/50 transition">
              <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="yourwebsite.com"
                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-gray-600"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-3 rounded-xl bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && result.analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Overview */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{result.analysis.businessName}</h2>
                  <p className="text-gray-400">{result.analysis.businessType} | {result.platform}</p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${result.analysis.score >= 7 ? 'text-green-400' : result.analysis.score >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.analysis.score}/10
                  </div>
                  <p className="text-xs text-gray-500">Site Score</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className={`flex items-center gap-1 ${result.hasSSL ? 'text-green-400' : 'text-red-400'}`}>
                  <Shield className="w-4 h-4" /> {result.hasSSL ? 'SSL Secure' : 'No SSL'}
                </span>
                <span className="text-[#00d4ff] flex items-center gap-1">
                  <Zap className="w-4 h-4" /> {result.analysis.estimatedLeadsLost}
                </span>
              </div>
            </div>

            {/* AI Agent Opportunities */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">How an AI Agent Would Help</h3>
              <ul className="space-y-3">
                {result.analysis.aiAgentOpportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Conversation */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Sample Agent Conversation</h3>
              <p className="text-sm text-gray-500 mb-4">This is what a visitor interaction would look like on your site:</p>
              <div className="space-y-3">
                {result.analysis.sampleConversation.split(' | ').map((msg, i) => {
                  const isVisitor = msg.startsWith('Visitor:')
                  const content = msg.replace(/^(Visitor:|Agent:)\s*/, '')
                  return (
                    <div key={i} className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        isVisitor ? 'bg-[#00d4ff] text-black rounded-br-sm' : 'bg-[#1f1f2e] text-gray-200 rounded-bl-sm'
                      }`}>
                        {content}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div className="glass-card rounded-2xl p-8 glow-cyan animate-border-glow">
              <h3 className="text-xl font-bold text-white mb-3">Our Recommendation</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{result.analysis.recommendation}</p>
              <a href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition">
                Get Your AI Agent Built <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
