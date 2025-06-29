"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'

interface FloatingWordProps {
  word: Word
  index: number
}

const FloatingWord = ({ word, index }: FloatingWordProps) => {
  const [position, setPosition] = useState({
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 200 : 800),
    y: Math.random() * 300 + 100,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * (window.innerWidth - 250),
        y: Math.random() * (window.innerHeight - 200) + 100,
      })
    }, 6000 + index * 800) // Stagger the movement

    return () => clearInterval(interval)
  }, [index])

  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      initial={{ x: position.x, y: position.y, opacity: 0, scale: 0 }}
      animate={{ 
        x: position.x, 
        y: position.y, 
        opacity: 0.8, 
        scale: 1,
        rotate: [0, 5, -5, 0],
      }}
      transition={{ 
        duration: 2,
        x: { duration: 8, ease: "easeInOut" },
        y: { duration: 8, ease: "easeInOut" },
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{ left: 0, top: 0 }}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        
        {/* Main bubble */}
        <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 shadow-2xl hover:scale-110 transition-transform duration-300">
          <div className="text-sm font-medium text-white drop-shadow-lg">
            {word.original}
          </div>
          <div className="text-xs text-blue-100 drop-shadow">
            {word.turkishTranslation}
          </div>
          
          {/* Sparkle effect */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-70" />
        </div>
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