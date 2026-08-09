import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: '110px',
            fontWeight: 900,
            color: '#00d4ff',
          }}
        >
          F
        </div>
      </div>
    ),
    { ...size }
  )
}
