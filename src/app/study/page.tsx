"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Sparkles } from '@/components/aceternity/sparkles'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'
import { RotateCcw, CheckCircle, AlertCircle, Brain, ArrowLeft, Target, Zap, Star, Home } from 'lucide-react'
import Link from 'next/link'

export default function StudyPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    correct: 0
  })
  
  const { 
    todayQueue, 
    getTodayQueue, 
    submitReview, 
    startStudySession, 
    endStudySession 
  } = useWordStore()

  useEffect(() => {
    getTodayQueue()
    startStudySession()
    setStartTime(new Date())
    return () => endStudySession()
  }, [getTodayQueue, startStudySession, endStudySession])

  const currentWord = todayQueue[currentWordIndex]

  // Safety check
  if (!currentWord && todayQueue.length > 0 && currentWordIndex < todayQueue.length) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }
  
  const handleRating = (rating: 1 | 2 | 3 | 4) => {
    if (!currentWord || !startTime) return
    
    const responseTime = Date.now() - startTime.getTime()
    submitReview(currentWord.id, rating, responseTime)
    
    // Update session stats
    setSessionStats(prev => ({
      studied: prev.studied + 1,
      correct: prev.correct + (rating >= 3 ? 1 : 0)
    }))
    
    // Move to next word
    if (currentWordIndex < todayQueue.length - 1) {
      setCurrentWordIndex(prev => prev + 1)
      setShowAnswer(false)
      setStartTime(new Date())
    } else {
      // Session complete
      endStudySession()
    }
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    if (!startTime) setStartTime(new Date())
  }

  // No words to study
  if (todayQueue.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3),transparent_50%)]" />
        
        <Sparkles className="w-full h-full relative z-10">
          <div className="flex items-center justify-center min-h-screen p-4">
            <GlassCard variant="frosted" className="text-center max-w-md p-12">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                  All Caught Up! 🎉
                </h1>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  No words due for review today. Come back tomorrow or add new words to study.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button className="w-full text-lg px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-xl">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full text-lg px-6 py-3 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                    Add More Words
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </Sparkles>
      </div>
    )
  }

  // Session complete
  if (currentWordIndex >= todayQueue.length) {
    const accuracy = sessionStats.studied > 0 ? Math.round((sessionStats.correct / sessionStats.studied) * 100) : 0
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.3),transparent_50%)]" />
        
        <Sparkles className="w-full h-full relative z-10">
          <div className="flex items-center justify-center min-h-screen p-4">
            <GlassCard variant="rainbow" className="text-center max-w-lg p-12">
              <div className="mb-8">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Session Complete! 🧠
                </h1>
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  Excellent work! You've completed today's study session.
                </p>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <GlassCard variant="neon" className="p-4">
                  <div className="text-2xl font-bold text-cyan-400">{sessionStats.studied}</div>
                  <div className="text-sm text-cyan-200">Words Studied</div>
                </GlassCard>
                <GlassCard variant="frosted" className="p-4">
                  <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
                  <div className="text-sm text-green-200">Accuracy</div>
                </GlassCard>
              </div>
              
              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button className="w-full text-lg px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0 shadow-xl">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full text-lg px-6 py-3 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                    Add More Words
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </Sparkles>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.2),transparent_50%)]" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header with Back Button */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            
            <GlassCard variant="neon" className="px-4 py-2">
              <div className="flex items-center gap-2 text-white">
                <Target className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">
                  {currentWordIndex + 1} / {todayQueue.length}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <GlassCard variant="frosted" className="p-4">
              <div className="flex justify-between text-sm text-blue-200 mb-3">
                <span>Study Progress</span>
                <span>{Math.round(((currentWordIndex + 1) / todayQueue.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${((currentWordIndex + 1) / todayQueue.length) * 100}%` }}
                />
              </div>
            </GlassCard>
          </div>

          {/* Study Card */}
          <GlassCard variant="rainbow" className="p-8 min-h-[500px] flex flex-col justify-between">
            {/* Word State Badge */}
            <div className="flex justify-center mb-6">
              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                currentWord.state === 'new' 
                  ? 'bg-green-500/20 text-green-200' 
                  : 'bg-blue-500/20 text-blue-200'
              }`}>
                {currentWord.state === 'new' ? (
                  <>
                    <Star className="h-4 w-4" />
                    New Word
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Review
                  </>
                )}
              </div>
            </div>

            {/* Word Display */}
            <div className="text-center flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <div className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
                  {currentWord.germanTranslation}
                </div>
                
                {showAnswer && (
                  <div className="space-y-4 animate-in fade-in-50 duration-500">
                    <GlassCard variant="frosted" className="p-6">
                      <div className="text-sm text-blue-300 mb-2">🇬🇧 English</div>
                      <div className="text-2xl font-semibold text-white">{currentWord.original}</div>
                    </GlassCard>
                    
                    <GlassCard variant="neon" className="p-6">
                      <div className="text-sm text-cyan-300 mb-2">🇹🇷 Turkish</div>
                      <div className="text-2xl font-semibold text-white">{currentWord.turkishTranslation}</div>
                    </GlassCard>
                    
                    {currentWord.germanSentenceExample && (
                      <GlassCard variant="neon" className="p-6">
                        <div className="text-sm text-green-300 mb-2">🇩🇪 German Example</div>
                        <div className="text-lg text-green-100 italic">"{currentWord.germanSentenceExample}"</div>
                      </GlassCard>
                    )}
                    
                    {currentWord.verbForms && (
                      <GlassCard variant="frosted" className="p-6">
                        <div className="text-sm text-purple-300 mb-2">📚 Verb Forms</div>
                        <div className="text-lg text-purple-100 space-y-2">
                          {currentWord.verbForms.infinitive && <div>∞ {currentWord.verbForms.infinitive}</div>}
                          {currentWord.verbForms.pastTense && <div>📅 {currentWord.verbForms.pastTense}</div>}
                          {currentWord.verbForms.pastParticiple && <div>📋 {currentWord.verbForms.pastParticiple}</div>}
                          {currentWord.verbForms.presentTense && <div>🔄 {currentWord.verbForms.presentTense}</div>}
                        </div>
                      </GlassCard>
                    )}
                    
                    {currentWord.understandingContext && (
                      <GlassCard variant="default" className="p-6">
                        <div className="text-sm text-indigo-300 mb-2">💡 Understanding Context</div>
                        <div className="text-lg text-indigo-100">{currentWord.understandingContext}</div>
                      </GlassCard>
                    )}
                    
                    {currentWord.examples && currentWord.examples.length > 0 && (
                      <GlassCard variant="neon" className="p-6">
                        <div className="text-sm text-amber-300 mb-2">Example</div>
                        <div className="text-lg text-amber-100 italic">"{currentWord.examples[0]}"</div>
                      </GlassCard>
                    )}
                    
                    {currentWord.notes && (
                      <GlassCard variant="default" className="p-6">
                        <div className="text-sm text-purple-300 mb-2">Notes</div>
                        <div className="text-lg text-purple-100">{currentWord.notes}</div>
                      </GlassCard>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8">
              {!showAnswer ? (
                <div className="text-center">
                  <Button 
                    onClick={handleShowAnswer}
                    size="lg"
                    className="text-xl px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Target className="mr-3 h-6 w-6" />
                    Show Answer
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => handleRating(1)}
                    className="flex flex-col py-6 px-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <RotateCcw className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Again</span>
                    <span className="text-xs opacity-75">{"< 10min"}</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleRating(2)}
                    className="flex flex-col py-6 px-4 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <AlertCircle className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Hard</span>
                    <span className="text-xs opacity-75">{"< 1 day"}</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleRating(3)}
                    className="flex flex-col py-6 px-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <CheckCircle className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Good</span>
                    <span className="text-xs opacity-75">2-4 days</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleRating(4)}
                    className="flex flex-col py-6 px-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Star className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Easy</span>
                    <span className="text-xs opacity-75">1+ weeks</span>
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}