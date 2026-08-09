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

      {/* EFFECT: Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.3) 2px, rgba(0, 212, 255, 0.3) 3px)',
          backgroundSize: '100% 4px',
          animation: 'scanlines 8s linear infinite',
        }}
      />

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(32px); }
        }
      `}</style>
    </div>
  )
}
