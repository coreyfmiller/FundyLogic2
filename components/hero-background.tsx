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
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-[#00d4ff]/[0.08] blur-[100px]"
        animate={{
          x: ['-50%', '-45%', '-55%', '-50%'],
          y: ['-50%', '-55%', '-45%', '-50%'],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ translate: 'var(--mouse-x, 0px) var(--mouse-y, 0px)' }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#00d4ff]/[0.06] blur-[80px]"
        animate={{
          x: ['0%', '5%', '-3%', '0%'],
          y: ['0%', '-8%', '5%', '0%'],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-[#00d4ff]/[0.05] blur-[60px]"
        animate={{
          x: ['0%', '-6%', '4%', '0%'],
          y: ['0%', '6%', '-4%', '0%'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Subtle grid that shifts with mouse */}
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

      {/* Dot accents */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#00d4ff]/30"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + (i * 17) % 70}%`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  )
}
