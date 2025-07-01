"use client"

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Sparkles } from '@/components/aceternity/sparkles'
import { useWordStore } from '@/store'
import { Word } from '@/types/word'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Calendar, 
  Brain,
  Star,
  Target,
  Trash2,
  Edit,
  ArrowLeft,
  SortAsc,
  SortDesc,
  Clock
} from 'lucide-react'
import Link from 'next/link'

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'difficulty' | 'stability'
type FilterOption = 'all' | 'new' | 'learning' | 'review' | 'relearning'

export default function WordsPage() {
  const { words, deleteWord } = useWordStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and sort words
  const filteredAndSortedWords = useMemo(() => {
    let filtered = words

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(word => 
        word.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.turkishTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.germanTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply state filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(word => word.state === filterBy)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case 'oldest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'alphabetical':
          comparison = a.original.localeCompare(b.original)
          break
        case 'difficulty':
          comparison = a.difficulty - b.difficulty
          break
        case 'stability':
          comparison = a.stability - b.stability
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [words, searchTerm, sortBy, filterBy, sortOrder])

  const getStateColor = (state: string) => {
    switch (state) {
      case 'new': return 'bg-green-500/20 text-green-300 border-green-400/30'
      case 'learning': return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      case 'review': return 'bg-purple-500/20 text-purple-300 border-purple-400/30'
      case 'relearning': return 'bg-orange-500/20 text-orange-300 border-orange-400/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'new': return <Star className="h-3 w-3" />
      case 'learning': return <Brain className="h-3 w-3" />
      case 'review': return <Target className="h-3 w-3" />
      case 'relearning': return <Clock className="h-3 w-3" />
      default: return <BookOpen className="h-3 w-3" />
    }
  }

  const handleDelete = (wordId: string, wordText: string) => {
    if (confirm(`Delete "${wordText}"? This action cannot be undone.`)) {
      deleteWord(wordId)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
      
      <Sparkles className="w-full min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="outline" className="mb-4 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Your Word Collection 📚
            </h1>
            <p className="text-xl text-blue-100">
              {words.length} words in your vocabulary library
            </p>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <GlassCard variant="frosted" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
                  <input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="all">All States</option>
                    <option value="new">New</option>
                    <option value="learning">Learning</option>
                    <option value="review">Review</option>
                    <option value="relearning">Relearning</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="stability">Stability</option>
                  </select>
                  <Button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-wrap gap-4 text-sm text-blue-200">
                  <span>Showing {filteredAndSortedWords.length} of {words.length} words</span>
                  {searchTerm && <span>• Filtered by "{searchTerm}"</span>}
                  {filterBy !== 'all' && <span>• State: {filterBy}</span>}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Words Grid */}
          {filteredAndSortedWords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedWords.map((word) => (
                <GlassCard key={word.id} variant="neon" className="p-6 group hover:scale-105 transition-transform duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStateColor(word.state)}`}>
                      {getStateIcon(word.state)}
                      {word.state}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-blue-300 hover:text-white">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0 text-red-300 hover:text-white"
                        onClick={() => handleDelete(word.id, word.original)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-white mb-2">{word.germanTranslation}</div>
                      <div className="text-sm text-gray-300">{word.original} • {word.turkishTranslation}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-green-500/20 rounded-lg p-3">
                        <div className="text-xs text-green-300 mb-1">🇩🇪 German</div>
                        <div className="text-green-100 font-medium">{word.germanTranslation}</div>
                      </div>
                      
                      <div className="bg-blue-500/20 rounded-lg p-3">
                        <div className="text-xs text-blue-300 mb-1">🇬🇧 English</div>
                        <div className="text-blue-100 font-medium">{word.original}</div>
                      </div>
                      
                      <div className="bg-cyan-500/20 rounded-lg p-3">
                        <div className="text-xs text-cyan-300 mb-1">🇹🇷 Turkish</div>
                        <div className="text-cyan-100 font-medium">{word.turkishTranslation}</div>
                      </div>
                    </div>

                    {word.germanSentenceExample && (
                      <div className="bg-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-300 mb-1">🇩🇪 German Example</div>
                        <div className="text-amber-100 text-sm italic">"{word.germanSentenceExample}"</div>
                      </div>
                    )}

                    {word.verbForms && (
                      <div className="bg-purple-500/20 rounded-lg p-3">
                        <div className="text-xs text-purple-300 mb-1">📚 Verb Forms</div>
                        <div className="text-purple-100 text-sm space-y-1">
                          {word.verbForms.infinitive && <div>∞ {word.verbForms.infinitive}</div>}
                          {word.verbForms.pastTense && <div>📅 {word.verbForms.pastTense}</div>}
                          {word.verbForms.pastParticiple && <div>📋 {word.verbForms.pastParticiple}</div>}
                        </div>
                      </div>
                    )}

                    {word.understandingContext && (
                      <div className="bg-indigo-500/20 rounded-lg p-3">
                        <div className="text-xs text-indigo-300 mb-1">💡 Context</div>
                        <div className="text-indigo-100 text-sm">{word.understandingContext}</div>
                      </div>
                    )}

                    {word.examples && word.examples.length > 0 && (
                      <div className="bg-amber-500/20 rounded-lg p-3">
                        <div className="text-xs text-amber-300 mb-1">Example</div>
                        <div className="text-amber-100 text-sm italic">"{word.examples[0]}"</div>
                      </div>
                    )}

                    {word.notes && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xs text-purple-300 mb-1">Notes</div>
                        <div className="text-purple-100 text-sm">{word.notes}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-blue-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(word.createdAt).toLocaleDateString()}
                      </span>
                      <span>Reviews: {word.reviewCount}</span>
                    </div>

                    {word.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {word.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {word.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-blue-200">
                            +{word.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard variant="frosted" className="p-12 text-center">
              <BookOpen className="mx-auto h-16 w-16 text-blue-400 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || filterBy !== 'all' ? 'No words found' : 'No words yet'}
              </h3>
              <p className="text-blue-200 mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Add your first word to get started on your language learning journey!'
                }
              </p>
              {!searchTerm && filterBy === 'all' && (
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                    Add Your First Word
                  </Button>
                </Link>
              )}
            </GlassCard>
          )}
        </div>
      </Sparkles>
    </div>
  )
}