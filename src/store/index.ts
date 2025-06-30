import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Word, StudyStats, ReviewSession } from '@/types/word'
import { backupManager } from '@/lib/backup'

interface WordStore {
  // State
  words: Word[]
  currentSession: ReviewSession | null
  todayQueue: Word[]
  stats: StudyStats
  isLoading: boolean
  
  // Actions
  addWord: (word: {
    original: string
    turkishTranslation: string
    germanTranslation: string
    notes?: string
    examples?: string[]
    tags?: string[]
  }) => void
  updateWord: (id: string, updates: Partial<Word>) => void
  deleteWord: (id: string) => void
  submitReview: (wordId: string, rating: 1 | 2 | 3 | 4, responseTime: number) => void
  getTodayQueue: () => Word[]
  startStudySession: () => void
  endStudySession: () => void
  calculateStats: () => StudyStats
}

const initialStats: StudyStats = {
  totalWords: 0,
  wordsLearned: 0,
  wordsToReview: 0,
  dailyStreak: 0,
  retentionRate: 0,
  averageSessionTime: 0,
}

// Helper to convert date strings back to Date objects
const deserializeDates = (words: any[]): Word[] => {
  return words.map(word => ({
    ...word,
    createdAt: new Date(word.createdAt),
    nextReview: new Date(word.nextReview),
    lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : undefined,
  }))
}

export const useWordStore = create<WordStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        words: [],
        currentSession: null,
        todayQueue: [],
        stats: initialStats,
        isLoading: false,

        // Actions
        addWord: (wordData) => {
          const newWord: Word = {
            id: crypto.randomUUID(),
            original: wordData.original,
            turkishTranslation: wordData.turkishTranslation,
            germanTranslation: wordData.germanTranslation,
            notes: wordData.notes || '',
            examples: wordData.examples || [],
            tags: wordData.tags || [],
            createdAt: new Date(),
            difficulty: 5, // Initial difficulty
            stability: 1, // Initial stability (1 day)
            retrievability: 1, // Initial retrievability (100%)
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Review tomorrow
            reviewCount: 0,
            lapseCount: 0,
            state: 'new',
          }
          
          set((state) => {
            const newState = {
              words: [...state.words, newWord],
              stats: get().calculateStats(),
            }
            
            // Create automatic backup after adding word
            setTimeout(() => {
              backupManager.createBackup(newState.words, newState.stats, 'auto')
                .catch(err => console.warn('Backup failed:', err))
            }, 100)
            
            return newState
          })
        },

        updateWord: (id, updates) => {
          set((state) => {
            const newState = {
              words: state.words.map((word) =>
                word.id === id ? { ...word, ...updates } : word
              ),
              stats: get().calculateStats(),
            }
            
            // Create backup after significant updates (reviews)
            if (updates.reviewCount !== undefined || updates.state !== undefined) {
              setTimeout(() => {
                backupManager.createBackup(newState.words, newState.stats, 'auto')
                  .catch(err => console.warn('Backup failed:', err))
              }, 100)
            }
            
            return newState
          })
        },

        deleteWord: (id) => {
          set((state) => {
            const newState = {
              words: state.words.filter((word) => word.id !== id),
              stats: get().calculateStats(),
            }
            
            // Always backup after deletion
            setTimeout(() => {
              backupManager.createBackup(newState.words, newState.stats, 'auto')
                .catch(err => console.warn('Backup failed:', err))
            }, 100)
            
            return newState
          })
        },

        submitReview: async (wordId, rating, responseTime) => {
          const word = get().words.find(w => w.id === wordId)
          if (!word) return

          // Simple FSRS-inspired algorithm
          const now = new Date()
          let newStability = word.stability
          let newDifficulty = word.difficulty
          let newState = word.state
          let nextReviewDate: Date

          // Update based on rating
          switch (rating) {
            case 1: // Again
              newStability = Math.max(1, word.stability * 0.5)
              newDifficulty = Math.min(10, word.difficulty + 1)
              newState = word.state === 'new' ? 'learning' : 'relearning'
              nextReviewDate = new Date(now.getTime() + 10 * 60 * 1000) // 10 minutes
              break
            case 2: // Hard
              newStability = word.stability * 1.2
              newDifficulty = Math.min(10, word.difficulty + 0.5)
              nextReviewDate = new Date(now.getTime() + newStability * 0.8 * 24 * 60 * 60 * 1000)
              break
            case 3: // Good
              newStability = word.stability * 2
              if (word.state === 'new') newState = 'learning'
              else if (word.state === 'learning') newState = 'review'
              nextReviewDate = new Date(now.getTime() + newStability * 24 * 60 * 60 * 1000)
              break
            case 4: // Easy
              newStability = word.stability * 3
              newDifficulty = Math.max(1, word.difficulty - 0.5)
              newState = 'review'
              nextReviewDate = new Date(now.getTime() + newStability * 1.5 * 24 * 60 * 60 * 1000)
              break
          }

          // Update retrievability (simplified)
          const daysSinceLastReview = word.lastReviewed 
            ? (now.getTime() - word.lastReviewed.getTime()) / (1000 * 60 * 60 * 24)
            : 1
          const newRetrievability = Math.exp(-daysSinceLastReview / newStability)

          get().updateWord(wordId, {
            difficulty: newDifficulty,
            stability: newStability,
            retrievability: newRetrievability,
            lastReviewed: now,
            nextReview: nextReviewDate,
            reviewCount: word.reviewCount + 1,
            lapseCount: rating === 1 ? word.lapseCount + 1 : word.lapseCount,
            state: newState,
          })
        },

        getTodayQueue: () => {
          const now = new Date()
          const queue = get().words.filter(word => word.nextReview <= now)
          set({ todayQueue: queue })
          return queue
        },

        startStudySession: () => {
          const session: ReviewSession = {
            id: crypto.randomUUID(),
            userId: 'current-user', // TODO: Replace with actual user ID
            startTime: new Date(),
            endTime: new Date(),
            cardsReviewed: 0,
            accuracy: 0,
            averageResponseTime: 0,
            reviews: [],
          }
          set({ currentSession: session })
        },

        endStudySession: () => {
          const session = get().currentSession
          if (session) {
            set({
              currentSession: {
                ...session,
                endTime: new Date(),
              },
            })
          }
        },

        calculateStats: () => {
          const words = get().words
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          
          const totalWords = words.length
          const wordsLearned = words.filter(w => w.state === 'review').length
          const wordsToReview = words.filter(w => w.nextReview <= now).length
          
          // Calculate retention rate from recent reviews
          const recentWords = words.filter(w => w.reviewCount > 0)
          const totalReviews = recentWords.reduce((sum, w) => sum + w.reviewCount, 0)
          const totalLapses = recentWords.reduce((sum, w) => sum + w.lapseCount, 0)
          const retentionRate = totalReviews > 0 ? Math.round(((totalReviews - totalLapses) / totalReviews) * 100) : 0
          
          return {
            totalWords,
            wordsLearned,
            wordsToReview,
            dailyStreak: 0, // TODO: Implement streak calculation
            retentionRate,
            averageSessionTime: 0, // TODO: Calculate from sessions
          }
        },
      }),
      {
        name: 'word-store',
        partialize: (state) => ({
          words: state.words,
          stats: state.stats,
        }),
        onRehydrateStorage: () => (state) => {
          // Convert date strings back to Date objects when loading from storage
          if (state && state.words) {
            state.words = deserializeDates(state.words)
            // Recalculate stats after rehydration
            state.stats = state.calculateStats()
          }
        },
      }
    ),
    { name: 'WordStore' }
  )
)