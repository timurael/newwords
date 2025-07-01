"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from '@/components/aceternity/sparkles'
import { GitHubSync } from '@/components/features/settings/GitHubSync'
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      
      <Sparkles className="w-full min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="outline" className="mb-4 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-3">
              <SettingsIcon className="h-10 w-10 text-purple-400" />
              Settings
            </h1>
            <p className="text-xl text-purple-100">
              Configure your WordMemory experience and data synchronization
            </p>
          </div>

          {/* GitHub Sync Section */}
          <div className="space-y-8">
            <GitHubSync />
          </div>
        </div>
      </Sparkles>
    </div>
  )
}