import { posts, getPostBySlug } from '@/lib/blog-posts'
import { blogContent } from '@/lib/blog-content'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, 'AI agents', 'small business', 'New Brunswick', 'Atlantic Canada'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Corey Miller'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `https://fundylogic.com/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const content = blogContent[slug] || ''
  const currentIndex = posts.findIndex(p => p.slug === slug)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Corey Miller',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FundyLogic',
      url: 'https://fundylogic.com',
    },
    mainEntityOfPage: `https://fundylogic.com/blog/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#0a0a0f]">
        <nav className="border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="FundyLogic" className="h-8" />
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <Link href="/#services" className="hover:text-white transition">Services</Link>
              <Link href="/#demo" className="hover:text-white transition">Demo</Link>
              <Link href="/blog" className="hover:text-white transition">Blog</Link>
              <Link href="/analyze" className="hover:text-white transition">Free Audit</Link>
            </div>
            <Link href="/#contact" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-black text-sm font-semibold hover:bg-[#00b8e6] transition">
              Book a Call
            </Link>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-4 py-16">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-[#00d4ff] bg-[#00d4ff]/10 px-2.5 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-gray-500">{post.date}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">{post.excerpt}</p>
          </header>

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-gray-300 prose-li:leading-relaxed
              prose-strong:text-white
              prose-ul:space-y-2 prose-ul:my-4
              prose-a:text-[#00d4ff] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Post navigation */}
          <div className="mt-16 pt-8 border-t border-[#1f1f2e] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="glass-card rounded-xl p-4 hover:border-[#00d4ff]/20 transition group"
              >
                <span className="text-xs text-gray-500">← Previous</span>
                <p className="text-sm font-medium text-white group-hover:text-[#00d4ff] transition mt-1">
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="glass-card rounded-xl p-4 hover:border-[#00d4ff]/20 transition group sm:text-right sm:ml-auto"
              >
                <span className="text-xs text-gray-500">Next →</span>
                <p className="text-sm font-medium text-white group-hover:text-[#00d4ff] transition mt-1">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        </article>
      </div>
    </>
  )
}
