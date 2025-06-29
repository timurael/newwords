"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { WordTimeline } from '@/components/features/analytics/WordTimeline'
import { Sparkles } from '@/components/aceternity/sparkles'
import { useWordStore } from '@/store'
import { useBackup } from '@/lib/backup'
import { 
  TrendingUp, 
  Download, 
  Upload, 
  Shield, 
  Award, 
  Calendar, 
  Brain,
  Star,
  Target,
  Zap,
  Clock,
  ArrowLeft,
  Database,
  FileText,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function ProgressPage() {
  const { words, stats } = useWordStore()
  const { exportToFile, importFromFile, createBackup, getAllBackupMetadata, getStorageStats } = useBackup()
  const [isExporting, setIsExporting] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [storageInfo, setStorageInfo] = useState<any>(null)

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true)
    try {
      await exportToFile(words, stats, format)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleManualBackup = async () => {
    setIsBackingUp(true)
    try {
      await createBackup(words, stats, 'manual')
      alert('Manual backup created successfully!')
    } catch (error) {
      console.error('Backup failed:', error)
      alert('Backup failed. Please try again.')
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const importedData = await importFromFile(file)
      if (importedData) {
        const confirmImport = confirm(
          `Import ${importedData.words.length} words? This will replace your current data.`
        )
        if (confirmImport) {
          // Note: In a real app, you'd want to merge data or provide options
          window.location.reload() // Simple approach for demo
        }
      } else {
        alert('Import failed. Please check the file format.')
      }
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
    }
  }

  const loadStorageInfo = async () => {
    try {
      const info = await getStorageStats()
      setStorageInfo(info)
    } catch (error) {
      console.error('Failed to load storage info:', error)
    }
  }

  // Advanced learning metrics
  const learningMetrics = {
    masteryRate: stats.wordsLearned / Math.max(stats.totalWords, 1) * 100,
    learningVelocity: words.filter(w => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return w.createdAt >= weekAgo
    }).length,
    retentionStrength: words.filter(w => w.state === 'review' && w.retrievability > 0.8).length,
    strugglingWords: words.filter(w => w.lapseCount > 2).length
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
      
      <Sparkles className="w-full min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/dashboard">
                <Button variant="outline" className="mb-4 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                Your Learning Journey 🚀
              </h1>
              <p className="text-xl text-purple-100">
                Visualize your progress and celebrate your achievements
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden md:flex gap-3">
              <Button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button
                onClick={handleManualBackup}
                disabled={isBackingUp}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
              >
                <Shield className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
            </div>
          </div>

          {/* Advanced Learning Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard variant="neon" className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-violet-400 mb-1">
                {learningMetrics.masteryRate.toFixed(1)}%
              </div>
              <div className="text-sm text-violet-200">Mastery Rate</div>
              <div className="text-xs text-violet-300 mt-1">
                Words in review state
              </div>
            </GlassCard>

            <GlassCard variant="rainbow" className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {learningMetrics.learningVelocity}
              </div>
              <div className="text-sm text-green-200">Weekly Velocity</div>
              <div className="text-xs text-green-300 mt-1">
                New words this week
              </div>
            </GlassCard>

            <GlassCard variant="frosted" className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {learningMetrics.retentionStrength}
              </div>
              <div className="text-sm text-blue-200">Strong Retention</div>
              <div className="text-xs text-blue-300 mt-1">
                High confidence words
              </div>
            </GlassCard>

            <GlassCard variant="default" className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-400 mb-1">
                {learningMetrics.strugglingWords}
              </div>
              <div className="text-sm text-amber-200">Need Practice</div>
              <div className="text-xs text-amber-300 mt-1">
                Words with lapses
              </div>
            </GlassCard>
          </div>

          {/* Main Timeline */}
          <WordTimeline className="mb-8" />

          {/* Data Management Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Backup & Export */}
            <GlassCard variant="neon" className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-cyan-400" />
                Data Protection
              </h3>
              <p className="text-cyan-200 mb-6">
                Your words are automatically backed up every 5 minutes. Create manual backups and export your data for extra security.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  onClick={handleManualBackup}
                  disabled={isBackingUp}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 h-12"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {isBackingUp ? 'Creating...' : 'Manual Backup'}
                </Button>
                
                <Button
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 h-12"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
                
                <Button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-0 h-12"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 h-12">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyan-300">Storage Status</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={loadStorageInfo}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Refresh
                  </Button>
                </div>
                {storageInfo ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-cyan-200">
                      <span>Total Backups:</span>
                      <span>{storageInfo.totalBackups}</span>
                    </div>
                    <div className="flex justify-between text-cyan-200">
                      <span>IndexedDB:</span>
                      <span>{(storageInfo.indexedDB / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-cyan-300">Click refresh to load storage info</div>
                )}
              </div>
            </GlassCard>

            {/* Learning Insights */}
            <GlassCard variant="rainbow" className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-400" />
                Learning Insights
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200">Learning Capacity</span>
                    <span className="text-white font-semibold">{words.length} / 4000+</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((words.length / 4000) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-purple-300 mt-1">
                    Optimized for 4000+ words with enterprise-grade performance
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-purple-200 mb-2">Learning Recommendations</div>
                  {learningMetrics.strugglingWords > 0 ? (
                    <div className="text-amber-300 text-sm">
                      📚 Focus on {learningMetrics.strugglingWords} struggling words
                    </div>
                  ) : learningMetrics.learningVelocity < 3 ? (
                    <div className="text-blue-300 text-sm">
                      🚀 Try adding 3-5 words per day for optimal progress
                    </div>
                  ) : (
                    <div className="text-green-300 text-sm">
                      ✨ Excellent pace! Keep up the great work!
                    </div>
                  )}
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-purple-200 mb-2">Next Milestone</div>
                  {words.length < 100 ? (
                    <div className="text-yellow-300 text-sm">
                      🏆 {100 - words.length} words until Century Club
                    </div>
                  ) : words.length < 500 ? (
                    <div className="text-orange-300 text-sm">
                      🌟 {500 - words.length} words until Vocabulary Master
                    </div>
                  ) : words.length < 1000 ? (
                    <div className="text-red-300 text-sm">
                      👑 {1000 - words.length} words until Language Lord
                    </div>
                  ) : (
                    <div className="text-purple-300 text-sm">
                      🚀 You're a Language Legend! {words.length} words and counting!
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Achievements Section */}
          {words.length > 0 && (
            <GlassCard variant="frosted" className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-400" />
                Achievements Unlocked
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {words.length >= 1 && (
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg p-4 border border-green-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-6 w-6 text-green-400" />
                      <span className="font-semibold text-green-300">First Steps</span>
                    </div>
                    <p className="text-sm text-green-200">Added your first word!</p>
                  </div>
                )}
                
                {words.length >= 10 && (
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-lg p-4 border border-blue-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="h-6 w-6 text-blue-400" />
                      <span className="font-semibold text-blue-300">Word Collector</span>
                    </div>
                    <p className="text-sm text-blue-200">Reached 10 words milestone!</p>
                  </div>
                )}
                
                {words.length >= 50 && (
                  <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-lg p-4 border border-purple-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-6 w-6 text-purple-400" />
                      <span className="font-semibold text-purple-300">Half Century</span>
                    </div>
                    <p className="text-sm text-purple-200">Built a solid foundation!</p>
                  </div>
                )}
                
                {words.length >= 100 && (
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg p-4 border border-yellow-400/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-yellow-400" />
                      <span className="font-semibold text-yellow-300">Century Club</span>
                    </div>
                    <p className="text-sm text-yellow-200">Incredible dedication!</p>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </Sparkles>
    </div>
  )
}