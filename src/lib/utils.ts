import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function calculateRetentionRate(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0
}

export function getStudyStreakMessage(streak: number): string {
  if (streak === 0) return "Start your journey!"
  if (streak === 1) return "Great start! 🌱"
  if (streak < 7) return `${streak} days strong! 💪`
  if (streak < 30) return `${streak} days! You're on fire! 🔥`
  return `${streak} days! Incredible dedication! 🏆`
}