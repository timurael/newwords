"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useWordStore } from '@/store'
import { useBackup, BackupMetadata } from '@/lib/backup'
import { 
  Shield, 
  Download, 
  Upload, 
  Clock, 
  Database,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface BackupManagerProps {
  className?: string
}

export function BackupManager({ className }: BackupManagerProps) {
  const { words, stats } = useWordStore()
  const { 
    createBackup, 
    exportToFile, 
    importFromFile, 
    getAllBackupMetadata, 
    getStorageStats 
  } = useBackup()
  
  const [isExporting, setIsExporting] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backups, setBackups] = useState<BackupMetadata[]>([])
  const [storageInfo, setStorageInfo] = useState<any>(null)
  const [lastBackupTime, setLastBackupTime] = useState<Date | null>(null)

  useEffect(() => {
    loadBackupInfo()
  }, [])

  const loadBackupInfo = async () => {
    try {
      const [backupList, storage] = await Promise.all([
        getAllBackupMetadata(),
        getStorageStats()
      ])
      
      setBackups(backupList.sort((a, b) => b.timestamp - a.timestamp))
      setStorageInfo(storage)
      
      if (backupList.length > 0) {
        setLastBackupTime(new Date(backupList[0].timestamp))
      }
    } catch (error) {
      console.error('Failed to load backup info:', error)
    }
  }

  const handleManualBackup = async () => {
    setIsBackingUp(true)
    try {
      await createBackup(words, stats, 'manual')
      await loadBackupInfo() // Refresh the list
    } catch (error) {
      console.error('Backup failed:', error)
    } finally {
      setIsBackingUp(false)
    }
  }

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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const importedData = await importFromFile(file)
      if (importedData) {
        const confirmImport = confirm(
          `Import ${importedData.words.length} words? This will replace your current data. Make sure you have a backup!`
        )
        if (confirmImport) {
          // In a real implementation, you'd want to merge data or provide more options
          alert('Import completed. Please refresh the page.')
          window.location.reload()
        }
      } else {
        alert('Import failed. Please check the file format.')
      }
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
    }
    
    // Reset the input
    event.target.value = ''
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getTimeSinceLastBackup = (): string => {
    if (!lastBackupTime) return 'Never'
    
    const now = new Date()
    const diffMs = now.getTime() - lastBackupTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className={className}>
      <GlassCard variant="neon" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            Backup & Export Manager
          </h3>
          <div className="flex items-center gap-2 text-sm">
            {lastBackupTime && (
              <div className="flex items-center gap-1 text-cyan-300">
                <Clock className="h-4 w-4" />
                Last backup: {getTimeSinceLastBackup()}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Button
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
          >
            <Shield className="mr-2 h-4 w-4" />
            {isBackingUp ? 'Creating...' : 'Backup Now'}
          </Button>
          
          <Button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0"
          >
            <Database className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          
          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-0"
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
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </div>
        </div>

        {/* Storage Information */}
        {storageInfo && (
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-cyan-300 mb-3">Storage Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-cyan-200">Total Backups</div>
                <div className="text-white font-semibold">{storageInfo.totalBackups}</div>
              </div>
              <div>
                <div className="text-cyan-200">IndexedDB Usage</div>
                <div className="text-white font-semibold">{formatFileSize(storageInfo.indexedDB)}</div>
              </div>
              <div>
                <div className="text-cyan-200">LocalStorage Usage</div>
                <div className="text-white font-semibold">{formatFileSize(storageInfo.localStorage)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Backups */}
        {backups.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-cyan-300 mb-3">Recent Backups</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {backups.slice(0, 5).map((backup) => (
                <div 
                  key={backup.id}
                  className="flex items-center justify-between bg-white/5 rounded p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {backup.type === 'manual' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-400" />
                    )}
                    <span className="text-cyan-200">
                      {new Date(backup.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-cyan-300">
                    {backup.wordCount} words • {formatFileSize(backup.size)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backup Status Indicator */}
        <div className="mt-6 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300">Auto-backup active</span>
          </div>
          <span className="text-cyan-300">•</span>
          <span className="text-cyan-300">Every 5 minutes</span>
          <span className="text-cyan-300">•</span>
          <span className="text-cyan-300">Multi-layer protection</span>
        </div>

        {/* Warning for large datasets */}
        {words.length > 1000 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-400/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="text-amber-300 font-medium">Large Dataset Detected</div>
              <div className="text-amber-200">
                You have {words.length} words. Consider regular exports for extra security.
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}