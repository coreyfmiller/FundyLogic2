'use client'

import { motion } from 'framer-motion'

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary fog - large, slow, atmospheric */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[80%] h-[70%] rounded-full bg-[#00d4ff]/[0.07] blur-[160px]"
        animate={{
          x: ['0%', '3%', '-2%', '0%'],
          y: ['0%', '4%', '-2%', '0%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[60%] rounded-full bg-[#00d4ff]/[0.05] blur-[140px]"
        animate={{
          x: ['0%', '-3%', '2%', '0%'],
          y: ['0%', '-3%', '2%', '0%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0f 85%)',
        }}
      />
    </div>
  )
}
