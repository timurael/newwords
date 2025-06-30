"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'
import { Clock, Quote, MapPin, Sparkles, Calendar } from 'lucide-react'

interface WordMapBubbleProps {
  word: Word
  index: number
  totalWords: number
}

const WordMapBubble = ({ word, index, totalWords }: WordMapBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate spiral position for beautiful layout
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 6 // Multiple spirals
    const radius = 50 + (index / total) * 300 // Expanding radius
    const centerX = 400
    const centerY = 300
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    }
  }

  const position = getPosition(index, totalWords)
  
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

  // Color based on word age and progress
  const getWordColor = (word: Word) => {
    const age = Date.now() - word.createdAt.getTime()
    const days = age / (1000 * 60 * 60 * 24)
    
    if (word.state === 'review') return 'from-emerald-400 to-green-600'
    if (word.state === 'learning') return 'from-amber-400 to-orange-600'
    if (days < 1) return 'from-pink-400 to-rose-600'
    if (days < 7) return 'from-blue-400 to-cyan-600'
    return 'from-purple-400 to-violet-600'
  }

  return (
    <motion.div
      className="absolute cursor-pointer group"
      initial={{ 
        x: 400, 
        y: 300, 
        opacity: 0, 
        scale: 0,
        rotate: 0
      }}
      animate={{ 
        x: position.x, 
        y: position.y, 
        opacity: 1, 
        scale: isHovered ? 1.2 : 1,
        rotate: isHovered ? 5 : 0
      }}
      transition={{ 
        duration: 0.8 + index * 0.1,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      style={{ left: 0, top: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line to center (optional visual) */}
      <motion.div
        className="absolute w-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          height: Math.sqrt(Math.pow(position.x - 400, 2) + Math.pow(position.y - 300, 2)),
          transformOrigin: 'top center',
          transform: `rotate(${Math.atan2(position.y - 300, position.x - 400) * 180 / Math.PI + 90}deg)`,
          left: 400 - position.x,
          top: 300 - position.y
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0.1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getWordColor(word)} rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500`} />
      
      {/* Main word bubble */}
      <motion.div 
        className="relative bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden min-w-48"
        animate={{
          width: isHovered ? 'auto' : '12rem',
          height: isHovered ? 'auto' : 'auto'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 space-y-2">
          {/* Map pin indicator */}
          <div className="flex items-center justify-between">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <div className="flex items-center gap-1 text-xs text-yellow-300">
              <Clock className="w-3 h-3" />
              {getTimeAgo(word.createdAt)}
            </div>
          </div>
          
          {/* Original word with pulsing indicator */}
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-white drop-shadow-lg">
              {word.original}
            </div>
            <motion.div 
              className={`w-3 h-3 bg-gradient-to-r ${getWordColor(word)} rounded-full`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* All language translations */}
          <div className="space-y-1">
            <div className="text-sm text-cyan-200 drop-shadow flex items-center gap-1">
              🇹🇷 {word.turkishTranslation}
            </div>
            <div className="text-sm text-purple-200 drop-shadow flex items-center gap-1">
              🇩🇪 {word.germanTranslation}
            </div>
          </div>
          
          {/* Expanded details on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 border-t border-white/20 pt-2"
              >
                {/* Example sentence */}
                {word.examples && word.examples.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-green-200">
                    <Quote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="italic leading-relaxed">
                      {word.examples[0]}
                    </span>
                  </div>
                )}
                
                {/* Notes */}
                {word.notes && (
                  <div className="text-xs text-orange-200 italic flex items-start gap-1">
                    💡 {word.notes}
                  </div>
                )}
                
                {/* Learning progress */}
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-gray-300">
                    {word.state === 'new' ? 'New word' :
                     word.state === 'learning' ? 'Learning' :
                     word.state === 'review' ? 'In review' : 'Mastered'}
                  </span>
                  <span className="text-yellow-300">
                    ({word.reviewCount} reviews)
                  </span>
                </div>
                
                {/* Detailed timestamp */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {word.createdAt.toLocaleDateString()} at {word.createdAt.toLocaleTimeString()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tags if available */}
          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {word.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/20 text-xs text-cyan-200 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className={`h-1 bg-gradient-to-r ${getWordColor(word)} transition-all duration-500`} 
             style={{ 
               width: word.state === 'new' ? '25%' :
                      word.state === 'learning' ? '50%' :
                      word.state === 'review' ? '75%' : '100%'
             }} 
        />
        
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full animate-pulse opacity-80" />
        {isHovered && (
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full animate-bounce opacity-70" />
        )}
      </motion.div>
    </motion.div>
  )
}

export function WordMap() {
  const words = useWordStore((state) => state.words)
  const [centerText, setCenterText] = useState("Your Word Universe")
  
  // Sort words by creation date for better spiral effect
  const sortedWords = [...words].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  useEffect(() => {
    const stats = [
      `${words.length} words discovered`,
      `${words.filter(w => w.state === 'review').length} mastered`,
      `Your learning journey`,
      `Word constellation`
    ]
    
    let index = 0
    const interval = setInterval(() => {
      setCenterText(stats[index])
      index = (index + 1) % stats.length
    }, 3000)
    
    return () => clearInterval(interval)
  }, [words])

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-white/60">
        <div className="text-center space-y-4">
          <MapPin className="w-16 h-16 mx-auto text-cyan-400/50" />
          <div className="text-xl">Your word map will appear here</div>
          <div className="text-sm">Add some words to see them floating in your personal universe!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Central hub */}
      <motion.div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.div 
                key={centerText}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-sm font-semibold drop-shadow-lg"
              >
                {centerText}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Word bubbles in spiral */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {sortedWords.map((word, index) => (
            <WordMapBubble 
              key={word.id}
              word={word}
              index={index}
              totalWords={sortedWords.length}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-6 left-6 text-white/60 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Hover over bubbles to explore your words
        </div>
      </div>
      
      {/* Stats */}
      <div className="absolute top-6 right-6 text-white/80 text-sm space-y-1">
        <div>📍 {words.length} words mapped</div>
        <div>⭐ {words.filter(w => w.state === 'review').length} mastered</div>
        <div>🎯 {words.filter(w => w.state === 'learning').length} learning</div>
      </div>
    </div>
  )
}