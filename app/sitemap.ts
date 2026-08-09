import type { MetadataRoute } from 'next'
import { posts } from '@/lib/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const blogEntries: MetadataRoute.Sitemap = posts
    .filter(post => new Date(post.date) <= now)
    .map(post => ({
    url: `https://fundylogic.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://fundylogic.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://fundylogic.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://fundylogic.com/analyze',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://fundylogic.com/ai-ready-sites',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogEntries,
  ]
}
