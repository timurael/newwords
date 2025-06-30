"use client"

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BackgroundGradient } from '@/components/aceternity/background-gradient'
import { useWordStore } from '@/store'
import { Plus, Languages, Tag } from 'lucide-react'

export interface AddWordDialogRef {
  openDialog: () => void
}

export const AddWordDialog = forwardRef<AddWordDialogRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    original: '',
    turkishTranslation: '',
    germanTranslation: '',
    notes: '',
    examples: [] as string[],
    tags: [] as string[],
  })
  
  const addWord = useWordStore((state) => state.addWord)

  const handleOpenDialog = useCallback(() => {
    console.log('🟡 Add Word button clicked') // Debug log
    try {
      setIsOpen(true)
      setError(null)
      console.log('✅ Dialog state updated to open')
    } catch (err) {
      console.error('❌ Error opening dialog:', err)
    }
  }, [])

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openDialog: () => {
      console.log('🟡 Opening dialog via ref')
      handleOpenDialog()
    }
  }), [handleOpenDialog])

  // Debug: Log component state
  useEffect(() => {
    console.log('🔄 AddWordDialog rendered, isOpen:', isOpen)
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!formData.original.trim()) {
      setError('Please enter the original word')
      return
    }
    
    if (!formData.turkishTranslation.trim()) {
      setError('Please enter the Turkish translation')
      return
    }
    
    if (!formData.germanTranslation.trim()) {
      setError('Please enter the German translation')
      return
    }

    setIsSubmitting(true)
    
    try {
      addWord({
        original: formData.original.trim(),
        turkishTranslation: formData.turkishTranslation.trim(),
        germanTranslation: formData.germanTranslation.trim(),
        notes: formData.notes.trim(),
        examples: formData.examples.filter(ex => ex.trim()),
        tags: [
          ...formData.tags,
          new Date().toISOString().split('T')[0], // Add date tag
          'auto-tagged'
        ],
      })

      // Reset form
      setFormData({
        original: '',
        turkishTranslation: '',
        germanTranslation: '',
        notes: '',
        examples: [],
        tags: [],
      })
      
      // Close modal immediately after successful submission
      setIsOpen(false)
    } catch (err) {
      setError('Failed to add word. Please try again.')
      console.error('Error adding word:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      setError(null)
    }
  }, [formData.original, formData.turkishTranslation, formData.germanTranslation])

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleOpenDialog}
          onPointerDown={(e) => {
            console.log('🟡 Button pointer down event')
            e.stopPropagation()
          }}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-blue-600 hover:bg-blue-700"
          title="Add new word"
          type="button"
          style={{ zIndex: 9999 }}
        >
          <Plus className="h-6 w-6 text-white" />
          <span className="sr-only">Add new word</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <BackgroundGradient className="w-full max-w-md">
        <Card className="border-none bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Add New Word
            </CardTitle>
            <CardDescription>
              Enter the word with Turkish and German translations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Original Word
                </label>
                <Input
                  value={formData.original}
                  onChange={(e) => setFormData(prev => ({ ...prev, original: e.target.value }))}
                  placeholder="Enter the word..."
                  className="w-full"
                  autoFocus
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Turkish Translation
                </label>
                <Input
                  value={formData.turkishTranslation}
                  onChange={(e) => setFormData(prev => ({ ...prev, turkishTranslation: e.target.value }))}
                  placeholder="Türkçe çeviri..."
                  className="w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  German Translation
                </label>
                <Input
                  value={formData.germanTranslation}
                  onChange={(e) => setFormData(prev => ({ ...prev, germanTranslation: e.target.value }))}
                  placeholder="Deutsche Übersetzung..."
                  className="w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Example Sentence (Optional)
                </label>
                <Input
                  value={formData.examples[0] || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    examples: e.target.value ? [e.target.value] : []
                  }))}
                  placeholder="Example: 'The quick brown fox jumps...'"
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Notes (Optional)
                </label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Word
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false)
                    setError(null)
                    setIsSubmitting(false)
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </BackgroundGradient>
    </div>
  )
})

AddWordDialog.displayName = 'AddWordDialog'