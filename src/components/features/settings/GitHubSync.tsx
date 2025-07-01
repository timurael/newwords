"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { useWordStore } from '@/store'
import { Github, Upload, Download, Key, CheckCircle, AlertCircle } from 'lucide-react'

export function GitHubSync() {
  const [githubToken, setGithubToken] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const { 
    syncToGitHub, 
    loadFromGitHub, 
    initializeGitHubToken,
    words 
  } = useWordStore()

  const handleConnect = () => {
    if (githubToken.trim()) {
      initializeGitHubToken(githubToken.trim())
      setIsConnected(true)
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const handleSyncToGitHub = async () => {
    setIsSyncing(true)
    try {
      const success = await syncToGitHub()
      setSyncStatus(success ? 'success' : 'error')
    } catch (error) {
      setSyncStatus('error')
    }
    setIsSyncing(false)
    setTimeout(() => setSyncStatus('idle'), 3000)
  }

  const handleLoadFromGitHub = async () => {
    setIsSyncing(true)
    try {
      await loadFromGitHub()
      setSyncStatus('success')
    } catch (error) {
      setSyncStatus('error')
    }
    setIsSyncing(false)
    setTimeout(() => setSyncStatus('idle'), 3000)
  }

  return (
    <GlassCard variant="frosted" className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Github className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">GitHub Data Sync</h2>
        {isConnected && (
          <div className="flex items-center gap-1 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Connected</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* GitHub Token Setup */}
        <div>
          <label className="text-sm font-medium text-blue-200 mb-2 block flex items-center gap-2">
            <Key className="h-4 w-4" />
            GitHub Personal Access Token
          </label>
          <div className="flex gap-3">
            <Input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="flex-1 bg-white/10 border-white/30 text-white placeholder-blue-300"
              disabled={isConnected}
            />
            <Button
              onClick={handleConnect}
              disabled={!githubToken.trim() || isConnected}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Connect
            </Button>
          </div>
          <p className="text-xs text-blue-300 mt-2">
            Create a token at{' '}
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              github.com/settings/tokens
            </a>{' '}
            with repository write permissions
          </p>
        </div>

        {/* Sync Actions */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-400" />
                Backup to GitHub
              </h3>
              <p className="text-sm text-blue-200 mb-4">
                Save your {words.length} words to your GitHub repository. 
                This creates a commit with your vocabulary data.
              </p>
              <Button
                onClick={handleSyncToGitHub}
                disabled={isSyncing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSyncing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Sync to GitHub
                  </>
                )}
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Download className="h-5 w-5 text-green-400" />
                Restore from GitHub
              </h3>
              <p className="text-sm text-blue-200 mb-4">
                Load vocabulary data from your GitHub repository. 
                This will replace your current words.
              </p>
              <Button
                onClick={handleLoadFromGitHub}
                disabled={isSyncing}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {isSyncing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Load from GitHub
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {syncStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-400 bg-green-900/20 rounded-lg p-3">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Operation completed successfully!</span>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/20 rounded-lg p-3">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Operation failed. Please check your token and try again.</span>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Your vocabulary is stored as JSON in your GitHub repository</li>
            <li>• Each sync creates a new commit with timestamp</li>
            <li>• Data is version controlled - you can see history of changes</li>
            <li>• Works across all your devices with the same GitHub account</li>
            <li>• Data is private if your repository is private</li>
          </ul>
        </div>
      </div>
    </GlassCard>
  )
}