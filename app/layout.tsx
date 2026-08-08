import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://fundylogic.com'),
  title: {
    default: 'FundyLogic — AI Agents for Small Business',
    template: '%s | FundyLogic',
  },
  description: 'Custom-built AI agents that live on your website. Qualify leads, answer questions 24/7, and automate follow-up. Built in New Brunswick, Canada.',
  keywords: ['AI agents', 'chatbot', 'lead generation', 'business automation', 'AI for small business', 'New Brunswick', 'Atlantic Canada'],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'FundyLogic',
    title: 'FundyLogic — AI Agents for Small Business',
    description: 'Custom-built AI agents that qualify leads, answer questions 24/7, and automate follow-up.',
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
        {children}
      </body>
    </html>
  )
}
