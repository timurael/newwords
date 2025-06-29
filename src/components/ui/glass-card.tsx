"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'frosted' | 'neon' | 'rainbow'
}

export function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  const variants = {
    default: "bg-white/10 backdrop-blur-md border border-white/20",
    frosted: "bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl",
    neon: "bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-lg border border-cyan-300/30 shadow-cyan-500/25 shadow-2xl",
    rainbow: "bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-lg border border-white/30 shadow-2xl"
  }

  return (
    <div className={cn(
      "rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]",
      variants[variant],
      className
    )}>
      {children}
    </div>
  )
}