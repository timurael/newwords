"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/features/dashboard/StatsCard'
import { AddWordDialog, AddWordDialogRef } from '@/components/features/word-entry/AddWordDialog'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { BackupManager } from '@/components/features/backup/BackupManager'
import { useWordStore } from '@/store'
import { Play, Plus, BookOpen, Calendar, Target, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { words, todayQueue, getTodayQueue, stats } = useWordStore()
  
  useEffect(() => {
    getTodayQueue()
  }, [getTodayQueue])

  const recentWords = words.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">WordMemory Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and continue learning
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCard />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Study Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Study */}
            <BackgroundGradient>
              <Card className="border-none bg-white dark:bg-zinc-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Study Session
                  </CardTitle>
                  <CardDescription>
                    {todayQueue.length} words due for review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayQueue.length > 0 ? (
                    <>
                      <div className="text-2xl font-bold text-center py-4">
                        {todayQueue.length} words ready
                      </div>
                      <Link href="/study">
                        <Button size="lg" className="w-full">
                          <Play className="mr-2 h-5 w-5" />
                          Start Study Session
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <p className="text-lg font-semibold text-green-600">All caught up!</p>
                      <p className="text-muted-foreground">No words due for review today</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </BackgroundGradient>

            {/* Recent Words */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recently Added Words
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentWords.length > 0 ? (
                  <div className="space-y-3">
                    {recentWords.map((word) => (
                      <div key={word.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">{word.original}</div>
                          <div className="text-sm text-muted-foreground">
                            {word.turkishTranslation} • {word.germanTranslation}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(word.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No words added yet</p>
                    <p className="text-sm">Click the + button to add your first word</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/study">
                  <Button className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Start Studying
                  </Button>
                </Link>
                <Link href="/words">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Words
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Learning Journey
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Study Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-800 dark:text-blue-200">Consistency is key!</p>
                  <p className="text-blue-700 dark:text-blue-300">Study a little bit every day for best results.</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-200">Don't rush</p>
                  <p className="text-green-700 dark:text-green-300">Take time to really think before revealing the answer.</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="font-medium text-purple-800 dark:text-purple-200">Use context</p>
                  <p className="text-purple-700 dark:text-purple-300">Add notes and examples to help remember words.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Protection Section */}
        {words.length > 10 && (
          <div className="mt-8">
            <BackupManager />
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <AddWordDialog />
    </div>
  )
}