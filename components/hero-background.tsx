'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      container.style.setProperty('--mouse-x', `${x * 20}px`)
      container.style.setProperty('--mouse-y', `${y * 20}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fog layers */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[80%] rounded-full bg-[#00d4ff]/[0.06] blur-[150px]"
        animate={{
          x: ['-5%', '3%', '-2%', '-5%'],
          y: ['0%', '5%', '-3%', '0%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[120%] h-[70%] rounded-full bg-[#00d4ff]/[0.05] blur-[130px]"
        animate={{
          x: ['0%', '-4%', '2%', '0%'],
          y: ['0%', '-5%', '3%', '0%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-1/3 left-1/3 w-[60%] h-[50%] rounded-full bg-[#00d4ff]/[0.04] blur-[120px]"
        animate={{
          x: ['0%', '5%', '-3%', '0%'],
          y: ['0%', '-4%', '6%', '0%'],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        style={{ translate: 'var(--mouse-x, 0px) var(--mouse-y, 0px)' }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'translate(var(--mouse-x, 0px), var(--mouse-y, 0px))',
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* EFFECT: Connection lines / constellation */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
        {[
          { x1: '15%', y1: '20%', x2: '35%', y2: '35%' },
          { x1: '35%', y1: '35%', x2: '55%', y2: '25%' },
          { x1: '55%', y1: '25%', x2: '75%', y2: '40%' },
          { x1: '75%', y1: '40%', x2: '85%', y2: '20%' },
          { x1: '25%', y1: '60%', x2: '45%', y2: '70%' },
          { x1: '45%', y1: '70%', x2: '65%', y2: '55%' },
          { x1: '65%', y1: '55%', x2: '80%', y2: '75%' },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#00d4ff"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0.6, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'easeInOut',
            }}
          />
        ))}
        {[
          { cx: '15%', cy: '20%' },
          { cx: '35%', cy: '35%' },
          { cx: '55%', cy: '25%' },
          { cx: '75%', cy: '40%' },
          { cx: '85%', cy: '20%' },
          { cx: '25%', cy: '60%' },
          { cx: '45%', cy: '70%' },
          { cx: '65%', cy: '55%' },
          { cx: '80%', cy: '75%' },
        ].map((dot, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={dot.cx} cy={dot.cy} r="2"
            fill="#00d4ff"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.8, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      <style jsx>{`
      `}</style>
    </div>
  )
}
