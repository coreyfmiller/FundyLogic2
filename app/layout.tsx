import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ChatWidget } from '@/components/chat/chat-widget'
import { StructuredData } from '@/components/structured-data'

export const metadata: Metadata = {
  metadataBase: new URL('https://fundylogic.com'),
  title: {
    default: 'FundyLogic — AI Agents for Small Business',
    template: '%s | FundyLogic',
  },
  description: 'Custom-built AI agents that live on your website. Qualify leads, answer questions 24/7, and automate follow-up. Built in New Brunswick, Canada.',
  keywords: ['AI agents', 'chatbot', 'lead generation', 'business automation', 'AI for small business', 'New Brunswick', 'Atlantic Canada', 'custom AI', 'website chat'],
  authors: [{ name: 'Corey Miller' }],
  creator: 'FundyLogic',
  publisher: 'Fundy Logic Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'FundyLogic',
    title: 'FundyLogic — AI Agents for Small Business',
    description: 'Custom-built AI agents that qualify leads, answer questions 24/7, and automate follow-up.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FundyLogic — AI Agents for Small Business',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FundyLogic — AI Agents for Small Business',
    description: 'Custom-built AI agents that qualify leads, answer questions 24/7, and automate follow-up.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://fundylogic.com',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <StructuredData />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
