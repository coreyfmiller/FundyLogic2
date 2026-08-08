import { posts } from '@/lib/blog-posts'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Practical guides on AI agents, lead generation, and automation for small businesses in Atlantic Canada.',
  alternates: {
    canonical: 'https://fundylogic.com/blog',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FundyLogic" className="h-8" />
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">Home</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
        <p className="text-gray-400 mb-12">Practical guides on AI, automation, and growing your business.</p>

        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="glass-card rounded-xl p-6 hover:border-[#00d4ff]/20 transition group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded">{post.category}</span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
