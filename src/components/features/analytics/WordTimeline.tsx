"use client"

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'
import { Calendar, Clock, TrendingUp, Star, Brain, Target } from 'lucide-react'

interface DayData {
  date: string
  count: number
  words: Word[]
  intensity: number
}

interface WordTimelineProps {
  className?: string
}

export function WordTimeline({ className }: WordTimelineProps) {
  const words = useWordStore((state) => state.words)
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year')

  // Create timeline data
  const timelineData = useMemo(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear() - 1, 0, 1) // Start from beginning of last year
    const days: DayData[] = []
    
    // Generate all days
    const currentDate = new Date(startDate)
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayWords = words.filter(word => 
        word.createdAt.toISOString().split('T')[0] === dateStr
      )
      
      days.push({
        date: dateStr,
        count: dayWords.length,
        words: dayWords,
        intensity: Math.min(dayWords.length / 5, 1) // Max intensity at 5 words per day
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }, [words])

  // Statistics
  const stats = useMemo(() => {
    const totalWords = words.length
    const wordsThisWeek = words.filter(word => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return word.createdAt >= weekAgo
    }).length
    
    const wordsThisMonth = words.filter(word => {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return word.createdAt >= monthAgo
    }).length

    const activeDays = timelineData.filter(day => day.count > 0).length
    const currentStreak = calculateCurrentStreak(timelineData)
    const longestStreak = calculateLongestStreak(timelineData)
    
    return {
      totalWords,
      wordsThisWeek,
      wordsThisMonth,
      activeDays,
      currentStreak,
      longestStreak,
      averagePerDay: totalWords / Math.max(activeDays, 1)
    }
  }, [timelineData])

  function calculateCurrentStreak(days: DayData[]): number {
    let streak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        streak++
      } else if (streak > 0) {
        break
      }
    }
    return streak
  }

  function calculateLongestStreak(days: DayData[]): number {
    let maxStreak = 0
    let currentStreak = 0
    
    for (const day of days) {
      if (day.count > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    
    return maxStreak
  }

  function getIntensityColor(intensity: number): string {
    if (intensity === 0) return 'bg-white/10'
    if (intensity <= 0.25) return 'bg-green-400/30'
    if (intensity <= 0.5) return 'bg-green-500/50'
    if (intensity <= 0.75) return 'bg-green-600/70'
    return 'bg-green-500/90'
  }

  function getIntensityGlow(intensity: number): string {
    if (intensity === 0) return ''
    if (intensity <= 0.25) return 'shadow-green-400/20 shadow-sm'
    if (intensity <= 0.5) return 'shadow-green-500/30 shadow-md'
    if (intensity <= 0.75) return 'shadow-green-600/40 shadow-lg'
    return 'shadow-green-500/60 shadow-xl'
  }

  // Group days by weeks for better visualization
  const weeklyData = useMemo(() => {
    const weeks: DayData[][] = []
    let currentWeek: DayData[] = []
    
    timelineData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay()
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      
      currentWeek.push(day)
      
      if (index === timelineData.length - 1) {
        weeks.push(currentWeek)
      }
    })
    
    return weeks
  }, [timelineData])

  return (
    <div className={className}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard variant="neon" className="p-4 text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalWords}</div>
          <div className="text-sm text-cyan-200">Total Words</div>
          <Brain className="mx-auto h-5 w-5 mt-2 text-cyan-300" />
        </GlassCard>
        
        <GlassCard variant="rainbow" className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div className="text-sm text-orange-200">Current Streak</div>
          <Target className="mx-auto h-5 w-5 mt-2 text-orange-300" />
        </GlassCard>
        
        <GlassCard variant="frosted" className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.wordsThisWeek}</div>
          <div className="text-sm text-purple-200">This Week</div>
          <Calendar className="mx-auto h-5 w-5 mt-2 text-purple-300" />
        </GlassCard>
        
        <GlassCard variant="default" className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.averagePerDay.toFixed(1)}</div>
          <div className="text-sm text-green-200">Avg/Day</div>
          <TrendingUp className="mx-auto h-5 w-5 mt-2 text-green-300" />
        </GlassCard>
      </div>

      {/* Main Timeline */}
      <GlassCard variant="rainbow" className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-400" />
            Word Acquisition Journey
          </h3>
          <p className="text-blue-200">
            Your learning progress over time - each square represents a day
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-53 gap-1 max-w-full overflow-x-auto">
            {weeklyData.map((week, weekIndex) => (
              week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${getIntensityColor(day.intensity)} ${getIntensityGlow(day.intensity)}`}
                  whileHover={{ scale: 1.5 }}
                  onHoverStart={() => setSelectedDay(day)}
                  onHoverEnd={() => setSelectedDay(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                />
              ))
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-sm text-blue-200">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDay && selectedDay.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <GlassCard variant="neon" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                <div className="flex items-center gap-2 text-cyan-300">
                  <Star className="h-4 w-4" />
                  <span>{selectedDay.count} words</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDay.words.map((word) => (
                  <div
                    key={word.id}
                    className="bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                  >
                    <div className="font-medium text-white">{word.original}</div>
                    <div className="text-sm text-cyan-200">
                      {word.turkishTranslation} • {word.germanTranslation}
                    </div>
                    <div className="text-xs text-blue-300 mt-1">
                      Added at {new Date(word.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Achievements */}
        {stats.longestStreak >= 7 && (
          <div className="mt-6">
            <GlassCard variant="frosted" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Week Warrior!</div>
                  <div className="text-sm text-blue-200">
                    Longest streak: {stats.longestStreak} days
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </GlassCard>
    </div>
  )
}