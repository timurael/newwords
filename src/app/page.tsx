"use client"

import { useState, useRef } from "react"
import { BackgroundGradient } from "@/components/aceternity/background-gradient";
import { Sparkles } from "@/components/aceternity/sparkles";
import { FloatingNav } from "@/components/aceternity/floating-navbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AddWordDialog } from "@/components/features/word-entry/AddWordDialog";
import { WordBubbles } from "@/components/features/word-display/WordBubbles";
import { Brain, BookOpen, Target, TrendingUp, Plus, Play, Sparkles as SparklesIcon, Zap, Star } from "lucide-react";
import { useWordStore } from "@/store";
import Link from "next/link";

const navItems = [
  { name: "Home", link: "/", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Dashboard", link: "/dashboard", icon: <Target className="h-4 w-4" /> },
  { name: "Study", link: "/study", icon: <Play className="h-4 w-4" /> },
  { name: "Words", link: "/words", icon: <Brain className="h-4 w-4" /> },
  { name: "Progress", link: "/progress", icon: <TrendingUp className="h-4 w-4" /> },
];

export default function HomePage() {
  const addWordRef = useRef<{ openDialog: () => void }>(null)
  const words = useWordStore((state) => state.words)
  const wordsCount = words.length

  const handleAddWordClick = () => {
    console.log('🟡 Add Word button clicked on landing page')
    addWordRef.current?.openDialog()
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.2),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,120,200,0.2),transparent_50%)]" />
      
      {/* Floating word bubbles */}
      <WordBubbles />
      
      <FloatingNav navItems={navItems} />
      
      {/* Hero Section */}
      <Sparkles className="h-screen w-full relative z-10">
        <div className="flex flex-col items-center justify-center h-full px-4 text-center relative">
          {/* Stats badge */}
          {wordsCount > 0 && (
            <div className="mb-6 animate-bounce">
              <GlassCard variant="neon" className="px-4 py-2">
                <div className="flex items-center gap-2 text-white">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {wordsCount} words in your collection!
                  </span>
                  <SparklesIcon className="h-4 w-4 text-blue-400" />
                </div>
              </GlassCard>
            </div>
          )}
          
          <GlassCard variant="rainbow" className="max-w-4xl p-12 text-white">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-2xl">
                  WordMemory
                </h1>
                <p className="text-2xl md:text-3xl text-blue-100 drop-shadow-lg font-medium">
                  Never forget a word you've learned ✨
                </p>
              </div>
              
              <p className="text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed drop-shadow">
                Master Turkish and German vocabulary with scientifically-proven spaced repetition. 
                Our intelligent algorithm adapts to your learning pattern for maximum retention.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="text-xl px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
                  onClick={handleAddWordClick}
                  type="button"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  {wordsCount === 0 ? 'Add Your First Word' : 'Add Another Word'}
                </Button>
                <Link href="/study">
                  <Button size="lg" className="text-xl px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                    <Play className="mr-3 h-6 w-6" />
                    Start Studying
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </Sparkles>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <GlassCard variant="frosted" className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Why WordMemory Works ⚡
              </h2>
              <p className="text-xl text-blue-100">
                Built on proven memory science for lasting vocabulary retention
              </p>
            </GlassCard>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard variant="neon" className="text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">FSRS Algorithm</h3>
                <p className="text-blue-200 mb-4">
                  Advanced spaced repetition that learns your memory patterns
                </p>
              </div>
              <ul className="space-y-3 text-cyan-100">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Adapts to your learning speed
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Optimizes review timing
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  90%+ retention rate
                </li>
              </ul>
            </GlassCard>

            <GlassCard variant="rainbow" className="text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Multi-Language</h3>
                <p className="text-blue-200 mb-4">
                  Turkish and German translations with audio support
                </p>
              </div>
              <ul className="space-y-3 text-green-100">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Native pronunciation
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Context examples
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Smart tagging system
                </li>
              </ul>
            </GlassCard>

            <GlassCard variant="frosted" className="text-center hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Smart Analytics</h3>
                <p className="text-blue-200 mb-4">
                  Track progress and optimize your learning journey
                </p>
              </div>
              <ul className="space-y-3 text-purple-100">
                <li className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-yellow-400" />
                  Learning streaks
                </li>
                <li className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-yellow-400" />
                  Retention insights
                </li>
                <li className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-yellow-400" />
                  Performance trends
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard variant="rainbow" className="p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Ready to Build Your Vocabulary? 🚀
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of learners who never forget words with WordMemory
            </p>
            <Button 
              size="lg" 
              className="text-xl px-12 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-300"
              onClick={handleAddWordClick}
              type="button"
            >
              <SparklesIcon className="mr-3 h-6 w-6" />
              Get Started Free
            </Button>
          </GlassCard>
        </div>
      </section>

      {/* Floating Add Word Button */}
      <AddWordDialog ref={addWordRef} />
    </div>
  );
}