export interface Word {
  id: string
  original: string
  turkishTranslation: string
  germanTranslation: string
  createdAt: Date
  tags: string[]
  difficulty: number // FSRS difficulty parameter (0-10)
  stability: number // FSRS stability parameter (days)
  retrievability: number // FSRS retrievability parameter (0-1)
  lastReviewed?: Date
  nextReview: Date
  reviewCount: number
  lapseCount: number
  audioUrl?: string
  examples?: string[]
  notes?: string
  state: 'new' | 'learning' | 'review' | 'relearning'
}

export interface ReviewSession {
  id: string
  userId: string
  startTime: Date
  endTime: Date
  cardsReviewed: number
  accuracy: number
  averageResponseTime: number
  reviews: Review[]
}

export interface Review {
  id: string
  wordId: string
  sessionId: string
  rating: 1 | 2 | 3 | 4 // Again(1), Hard(2), Good(3), Easy(4)
  responseTime: number
  timestamp: Date
  previousInterval: number
  newInterval: number
}

export interface StudyStats {
  totalWords: number
  wordsLearned: number
  wordsToReview: number
  dailyStreak: number
  retentionRate: number
  averageSessionTime: number
}