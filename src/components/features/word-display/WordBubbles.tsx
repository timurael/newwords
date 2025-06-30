"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'
import { Clock, Quote } from 'lucide-react'

interface FloatingWordProps {
  word: Word
  index: number
}

const FloatingWord = ({ word, index }: FloatingWordProps) => {
  const [position, setPosition] = useState({
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 280 : 800),
    y: Math.random() * 300 + 100,
  })
  
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * (window.innerWidth - 320),
        y: Math.random() * (window.innerHeight - 250) + 100,
      })
    }, 8000 + index * 1000) // Stagger the movement

    return () => clearInterval(interval)
  }, [index])

  // Calculate time since creation
  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return `${Math.floor(diffDays / 7)}w ago`
  }

  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      initial={{ x: position.x, y: position.y, opacity: 0, scale: 0 }}
      animate={{ 
        x: position.x, 
        y: position.y, 
        opacity: 0.9, 
        scale: 1,
        rotate: [0, 2, -2, 0],
      }}
      transition={{ 
        duration: 2.5,
        x: { duration: 10, ease: "easeInOut" },
        y: { duration: 10, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{ left: 0, top: 0 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
        
        {/* Main bubble */}
        <motion.div 
          className="relative bg-white/15 backdrop-blur-lg border border-white/25 rounded-2xl shadow-2xl overflow-hidden"
          animate={{
            scale: isExpanded ? 1.05 : 1,
            width: isExpanded ? 'auto' : 'auto',
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-3 space-y-1">
            {/* Original word */}
            <div className="text-base font-bold text-white drop-shadow-lg flex items-center gap-2">
              {word.original}
              <motion.div 
                className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            {/* Translations */}
            <div className="space-y-0.5">
              <div className="text-sm text-cyan-100 drop-shadow flex items-center gap-1">
                🇹🇷 {word.turkishTranslation}
              </div>
              <div className="text-sm text-purple-100 drop-shadow flex items-center gap-1">
                🇩🇪 {word.germanTranslation}
              </div>
            </div>
            
            {/* Time tag */}
            <div className="flex items-center gap-1 text-xs text-yellow-200 drop-shadow">
              <Clock className="w-3 h-3" />
              {getTimeAgo(word.createdAt)}
            </div>
            
            {/* Example sentence (if expanded and available) */}
            <AnimatePresence>
              {isExpanded && word.examples && word.examples.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/20 pt-2 mt-2"
                >
                  <div className="flex items-start gap-1 text-xs text-green-200">
                    <Quote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="italic leading-relaxed max-w-48">
                      {word.examples[0]}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Notes (if expanded and available) */}
            <AnimatePresence>
              {isExpanded && word.notes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-xs text-orange-200 italic max-w-48"
                >
                  💡 {word.notes}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full animate-pulse opacity-80" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full animate-bounce opacity-70" />
          
          {/* Progress indicator based on review state */}
          <div className={`absolute top-0 left-0 h-1 rounded-t-2xl transition-all duration-500 ${
            word.state === 'new' ? 'w-1/4 bg-gradient-to-r from-red-400 to-orange-400' :
            word.state === 'learning' ? 'w-2/4 bg-gradient-to-r from-orange-400 to-yellow-400' :
            word.state === 'review' ? 'w-3/4 bg-gradient-to-r from-yellow-400 to-green-400' :
            'w-full bg-gradient-to-r from-green-400 to-emerald-400'
          }`} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function WordBubbles() {
  const words = useWordStore((state) => state.words)
  const [visibleWords, setVisibleWords] = useState<Word[]>([])

  useEffect(() => {
    // Show the most recent 8 words as floating bubbles
    const recentWords = words.slice(-8).reverse()
    setVisibleWords(recentWords)
  }, [words])

  if (visibleWords.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
      <AnimatePresence>
        {visibleWords.map((word, index) => (
          <FloatingWord 
            key={word.id} 
            word={word} 
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}