import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'FundyLogic — AI Agents for Small Business'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            FundyLogic
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#00d4ff',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            AI Agents for Small Business
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#9ca3af',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.5,
            }}
          >
            Custom-built AI that qualifies leads, answers questions 24/7, and automates follow-up. Built in New Brunswick, Canada.
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '18px',
            color: '#6b7280',
          }}
        >
          fundylogic.com
        </div>
      </div>
    ),
    { ...size }
  )
}
