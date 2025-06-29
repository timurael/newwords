"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useWordStore } from '@/store'
import { Brain, Clock, Target, TrendingUp } from 'lucide-react'

export function StatsCard() {
  const stats = useWordStore((state) => state.stats)
  
  const retentionColor = stats.retentionRate >= 80 ? 'text-green-600' : 
                        stats.retentionRate >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Words</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalWords}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.totalWords} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.wordsLearned}</div>
          <div className="mt-2">
            <Progress 
              value={stats.totalWords > 0 ? (stats.wordsLearned / stats.totalWords) * 100 : 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.wordsToReview}</div>
          <p className="text-xs text-muted-foreground">
            Ready for review
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${retentionColor}`}>
            {stats.retentionRate}%
          </div>
          <div className="mt-2">
            <Progress 
              value={stats.retentionRate} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}