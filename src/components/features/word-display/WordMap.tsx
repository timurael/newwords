"use client"

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'
import { Clock, Quote, MapPin, Sparkles, Calendar, BrainCircuit } from 'lucide-react'

// Custom hook for mouse position with spring physics
const useMouse = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return { x: mouseX, y: mouseY }
}

// Custom hook for window size
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return size
}

interface WordMapBubbleProps {
  word: Word
  index: number
  totalWords: number
  mousePosition: { x: any; y: any }
}

const WordMapBubble = ({ word, index, totalWords, mousePosition }: WordMapBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()

  const getPosition = useMemo(() => {
    return (idx: number, total: number, width: number, height: number) => {
      const angle = (idx / total) * Math.PI * (4 + (total > 50 ? 2 : 0)) // More spirals for more words
      const radius = Math.min(width, height) * 0.1 + (idx / total) * Math.min(width, height) * 0.35
      const centerX = width / 2
      const centerY = height / 2
      
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      }
    }
  }, [])

  const position = getPosition(index, totalWords, windowSize.width, windowSize.height)

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return `${Math.floor(diffDays / 7)}w ago`
  }

  const getWordColor = (word: Word) => {
    const age = Date.now() - new Date(word.createdAt).getTime()
    const days = age / (1000 * 60 * 60 * 24)
    
    if (word.state === 'review') return 'from-emerald-400 to-green-600'
    if (word.state === 'learning') return 'from-amber-400 to-orange-600'
    if (days < 1) return 'from-pink-400 to-rose-600'
    if (days < 7) return 'from-blue-400 to-cyan-600'
    return 'from-purple-400 to-violet-600'
  }

  const dx = useSpring(position.x)
  const dy = useSpring(position.y)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const distance = Math.sqrt(Math.pow(mousePosition.x.get() - (rect.left + rect.width / 2), 2) + Math.pow(mousePosition.y.get() - (rect.top + rect.height / 2), 2))
      const pushFactor = 50 / Math.max(distance, 50)
      
      const angle = Math.atan2(mousePosition.y.get() - (rect.top + rect.height / 2), mousePosition.x.get() - (rect.left + rect.width / 2))
      
      dx.set(position.x - Math.cos(angle) * pushFactor)
      dy.set(position.y - Math.sin(angle) * pushFactor)
    }
  }, [mousePosition, position, dx, dy])

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer group"
      initial={{ x: windowSize.width / 2, y: windowSize.height / 2, opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: isHovered ? 1.2 : 1 }}
      style={{ x: dx, y: dy }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5, delay: index * 0.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${getWordColor(word)} rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500`} />
      
      <motion.div 
        className="relative bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl overflow-hidden min-w-48"
        whileHover={{ borderColor: 'rgba(255, 255, 255, 0.7)' }}
      >
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <div className="flex items-center gap-1 text-xs text-yellow-300">
              <Clock className="w-3 h-3" />
              {getTimeAgo(word.createdAt)}
            </div>
          </div>
          
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
          
          <div className="space-y-1">
            <div className="text-sm text-cyan-200 drop-shadow">🇹🇷 {word.turkishTranslation}</div>
            <div className="text-sm text-purple-200 drop-shadow">🇩🇪 {word.germanTranslation}</div>
          </div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 border-t border-white/20 pt-2"
              >
                {word.examples && word.examples.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-green-200">
                    <Quote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="italic leading-relaxed">{word.examples[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-gray-300">{word.state} ({word.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(word.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {word.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/20 text-xs text-cyan-200 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className={`h-1 bg-gradient-to-r ${getWordColor(word)}`} 
             style={{ width: `${(word.stability / 10) * 100}%` }} // Example progress
        />
      </motion.div>
    </motion.div>
  )
}

export function WordMap() {
  const words = useWordStore((state) => state.words)
  const sortedWords = useMemo(() => [...words].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), [words])
  const mousePosition = useMouse()
  const windowSize = useWindowSize()

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-white/60 bg-slate-900">
        <div className="text-center space-y-4">
          <BrainCircuit className="w-24 h-24 mx-auto text-cyan-400/30" />
          <div className="text-2xl font-bold">Your Word Universe Awaits</div>
          <div className="text-lg">Add your first word to begin the journey.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center text-white"
        style={{ x: '-50%', y: '-50%' }}
      >
        <motion.div
          className="w-48 h-48 rounded-full"
          animate={{
            background: [
              "radial-gradient(circle, rgba(100,116,139,0.3) 0%, rgba(100,116,139,0) 70%)",
              "radial-gradient(circle, rgba(100,116,139,0.4) 0%, rgba(100,116,139,0) 70%)",
              "radial-gradient(circle, rgba(100,116,139,0.3) 0%, rgba(100,116,139,0) 70%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold">{words.length}</div>
          <div className="text-lg">Words</div>
        </div>
      </motion.div>
      
      <div className="relative w-full h-full">
        <AnimatePresence>
          {sortedWords.map((word, index) => (
            <WordMapBubble 
              key={word.id}
              word={word}
              index={index}
              totalWords={sortedWords.length}
              mousePosition={mousePosition}
            />
          ))}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-6 left-6 text-white/60 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Hover over bubbles to explore your words
        </div>
      </div>
      
      <div className="absolute top-6 right-6 text-white/80 text-sm space-y-1 bg-black/20 p-3 rounded-lg">
        <div><Sparkles className="w-4 h-4 inline-block mr-2 text-yellow-400" />{words.length} words mapped</div>
        <div><BrainCircuit className="w-4 h-4 inline-block mr-2 text-green-400" />{words.filter(w => w.state === 'review').length} mastered</div>
        <div><Clock className="w-4 h-4 inline-block mr-2 text-amber-400" />{words.filter(w => w.state === 'learning').length} learning</div>
      </div>
    </div>
  )
}
