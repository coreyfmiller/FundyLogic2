'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, Globe, Shield, ArrowRight, AlertCircle, MessageCircle, CheckCircle, XCircle, MinusCircle, FileText, HelpCircle, Mail } from 'lucide-react'

interface ScoreItem {
  score: number
  reasoning: string
}

interface AnalysisResult {
  url: string
  title: string
  description: string
  platform: string
  hasSSL: boolean
  pagesAnalyzed: string[]
  pagesMissing: string[]
  analysis: {
    businessName: string
    businessType: string
    scores: {
      responseCapability: ScoreItem
      leadCapture: ScoreItem
      contentCompleteness: ScoreItem
      aiReadiness: ScoreItem
    }
    observations: string[]
    topQuestions: string[]
    aiAgentOpportunities: string[]
    sampleConversation: string
    recommendation: string
  } | null
  error?: string
}

const LOADING_STEPS = [
  'Fetching homepage...',
  'Discovering site pages...',
  'Analyzing services page...',
  'Analyzing contact page...',
  'Assessing lead capture...',
  'Generating AI agent assessment...',
]

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailSending, setEmailSending] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setLoadingStep(0)
    setError('')
    setResult(null)
    setEmailSent(false)

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => prev >= LOADING_STEPS.length - 1 ? prev : prev + 1)
    }, 3500)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` }),
      })
      const data = await res.json()
      clearInterval(stepInterval)
      if (data.error && !data.analysis) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      clearInterval(stepInterval)
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim() || !result) return
    setEmailSending(true)
    try {
      await fetch('/api/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, result }),
      })
      setEmailSent(true)
    } catch {
      // Still mark as sent to not block UX
      setEmailSent(true)
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid">
      <nav className="border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FundyLogic" className="h-8" />
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="/#services" className="hover:text-white transition">Services</a>
            <a href="/#demo" className="hover:text-white transition">Demo</a>
            <a href="/#pricing" className="hover:text-white transition">Pricing</a>
            <a href="/blog" className="hover:text-white transition">Blog</a>
          </div>
          <a href="/#contact" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-black text-sm font-semibold hover:bg-[#00b8e6] transition">
            Book a Call <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Free AI Agent Assessment</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            We'll crawl your site, analyze your pages, and show you exactly where an AI agent would make a difference.
          </p>
        </motion.div>

        {/* Input */}
        <form onSubmit={handleAnalyze} className="mb-10">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-3 bg-[#111118] border border-[#1f1f2e] rounded-xl px-4 py-3 focus-within:border-[#00d4ff]/50 transition">
              <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="yourwebsite.com"
                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-gray-600 text-sm"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-5 py-3 rounded-xl bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Analyzing' : 'Analyze'}
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-6">
              <div className="space-y-3">
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i < loadingStep ? (
                      <CheckCircle className="w-4 h-4 text-[#00d4ff] flex-shrink-0" />
                    ) : i === loadingStep ? (
                      <Loader2 className="w-4 h-4 text-[#00d4ff] animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#2a2a3e] flex-shrink-0" />
                    )}
                    <span className={`text-sm ${i <= loadingStep ? 'text-gray-300' : 'text-gray-600'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && result.analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{result.analysis.businessName}</h2>
                  <p className="text-sm text-gray-400">{result.analysis.businessType}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={`flex items-center gap-1 ${result.hasSSL ? 'text-[#00d4ff]' : 'text-red-400'}`}>
                    <Shield className="w-3.5 h-3.5" /> {result.hasSSL ? 'SSL' : 'No SSL'}
                  </span>
                  <span>{result.platform}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Pages analyzed: {result.pagesAnalyzed.join(', ')}
              </p>
            </div>

            {/* Scores */}
            <div className="grid sm:grid-cols-2 gap-4">
              <ScoreCard label="Response Capability" sublabel="Can visitors get answers?" score={result.analysis.scores.responseCapability} />
              <ScoreCard label="Lead Capture" sublabel="How easy is it to become a lead?" score={result.analysis.scores.leadCapture} />
              <ScoreCard label="Content Completeness" sublabel="Is key info easy to find?" score={result.analysis.scores.contentCompleteness} />
              <ScoreCard label="AI Readiness" sublabel="How trainable is the content?" score={result.analysis.scores.aiReadiness} />
            </div>

            {/* Email capture - PRIMARY CTA, right after scores deliver value */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border-[#00d4ff]/20">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1">Send me the full breakdown</h3>
                  <p className="text-xs text-gray-500 mb-3">Get this assessment with all recommendations delivered to your inbox.</p>
                  {emailSent ? (
                    <div className="flex items-center gap-2 text-sm text-[#00d4ff]">
                      <CheckCircle className="w-4 h-4" /> Sent! Check your inbox.
                    </div>
                  ) : (
                    <form onSubmit={handleEmailReport} className="flex gap-2 max-w-sm">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 bg-[#0a0a0f] border border-[#1f1f2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00d4ff]/50 transition"
                      />
                      <button
                        type="submit"
                        disabled={emailSending}
                        className="px-4 py-2.5 rounded-lg bg-[#00d4ff] text-black text-sm font-semibold hover:bg-[#00b8e6] transition disabled:opacity-50 flex-shrink-0"
                      >
                        {emailSending ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Pages found vs missing */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00d4ff]" /> Pages We Analyzed
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {result.pagesAnalyzed.map(page => (
                  <div key={page} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#00d4ff] flex-shrink-0" />
                    <span className="text-gray-300 capitalize">{page}</span>
                  </div>
                ))}
                {result.pagesMissing.map(page => (
                  <div key={page} className="flex items-center gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-red-400/70 flex-shrink-0" />
                    <span className="text-gray-500 capitalize">{page} <span className="text-[10px] text-gray-600">(not found)</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4">What We Found</h3>
              <ul className="space-y-3">
                {result.analysis.observations.map((obs, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <MinusCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    {obs}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Questions */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00d4ff]" /> Questions Your Agent Would Handle
              </h3>
              <p className="text-xs text-gray-500 mb-4">Based on your site content, these are the questions customers are likely asking:</p>
              <ul className="space-y-2">
                {result.analysis.topQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <MessageCircle className="w-3.5 h-3.5 text-[#00d4ff]/60 flex-shrink-0 mt-0.5" />
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Agent Opportunities */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-4">How an AI Agent Would Help</h3>
              <ul className="space-y-3">
                {result.analysis.aiAgentOpportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Conversation */}
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-2">Sample Agent Conversation</h3>
              <p className="text-xs text-gray-500 mb-4">What a visitor interaction could look like on your site:</p>
              <div className="space-y-2.5">
                {result.analysis.sampleConversation.split('\n').filter(Boolean).map((msg, i) => {
                  const isVisitor = msg.trim().startsWith('Visitor:')
                  const content = msg.replace(/^(Visitor:|Agent:)\s*/i, '').trim()
                  if (!content) return null
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

            {/* Recommendation + FINAL CTA - catches high-intent */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border-[#00d4ff]/20 glow-cyan">
              <h3 className="text-lg font-bold text-white mb-3">Our Take</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">{result.analysis.recommendation}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff] text-black font-semibold hover:bg-[#00b8e6] transition text-sm">
                  Let's talk about your agent <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/#demo"
                  className="text-xs text-gray-500 hover:text-[#00d4ff] transition"
                >
                  or try a demo agent first →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// --- Score Card ---
function ScoreCard({ label, sublabel, score }: { label: string; sublabel: string; score: ScoreItem }) {
  const getColor = (s: number) => {
    if (s >= 7) return 'text-[#00d4ff]'
    if (s >= 4) return 'text-yellow-400'
    return 'text-red-400'
  }
  const getBarColor = (s: number) => {
    if (s >= 7) return 'bg-[#00d4ff]'
    if (s >= 4) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-[11px] text-gray-500">{sublabel}</p>
        </div>
        <span className={`text-lg font-bold ${getColor(score.score)}`}>{score.score}/10</span>
      </div>
      <div className="w-full h-1.5 bg-[#1f1f2e] rounded-full mb-2 overflow-hidden">
        <div className={`h-full rounded-full ${getBarColor(score.score)}`} style={{ width: `${score.score * 10}%` }} />
      </div>
      <p className="text-[11px] text-gray-400 leading-relaxed">{score.reasoning}</p>
    </div>
  )
}
