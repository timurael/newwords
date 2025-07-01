import { Word } from '@/types/word'

// GitHub-based data persistence for WordMemory
// This ensures vocabulary data is always available and version controlled

export class GitHubDataManager {
  private readonly VOCABULARY_PATH = 'src/data/vocabulary.json'
  private readonly REPO_OWNER = 'timoel' // Replace with actual GitHub username
  private readonly REPO_NAME = 'newwords' // Replace with actual repo name
  
  constructor(private githubToken?: string) {}

  /**
   * Load vocabulary from local file (immediate access)
   * Falls back to this when GitHub API is unavailable
   */
  async loadLocalVocabulary(): Promise<Word[]> {
    try {
      const response = await fetch('/api/vocabulary')
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn('Failed to load local vocabulary:', error)
    }
    
    // Fallback to static import
    try {
      const vocabularyModule = await import('@/data/vocabulary.json')
      return vocabularyModule.default || []
    } catch {
      return []
    }
  }

  /**
   * Save vocabulary to GitHub repository
   * Creates a commit with the updated vocabulary
   */
  async saveToGitHub(words: Word[]): Promise<boolean> {
    if (!this.githubToken) {
      console.warn('GitHub token not available - cannot sync to repository')
      return false
    }

    try {
      const content = JSON.stringify(words, null, 2)
      const base64Content = btoa(unescape(encodeURIComponent(content)))
      
      // Get current file SHA for updating
      const getCurrentFile = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${this.VOCABULARY_PATH}`,
        {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      )

      let sha: string | undefined
      if (getCurrentFile.ok) {
        const fileData = await getCurrentFile.json()
        sha = fileData.sha
      }

      // Update or create file
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${this.VOCABULARY_PATH}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update vocabulary: ${words.length} words (${new Date().toISOString()})`,
            content: base64Content,
            sha: sha, // Required for updates
          }),
        }
      )

      if (response.ok) {
        console.log('✅ Vocabulary successfully synced to GitHub')
        return true
      } else {
        const error = await response.json()
        console.error('❌ Failed to sync to GitHub:', error)
        return false
      }
    } catch (error) {
      console.error('❌ GitHub sync error:', error)
      return false
    }
  }

  /**
   * Load vocabulary from GitHub repository
   * Gets the latest version from the repository
   */
  async loadFromGitHub(): Promise<Word[]> {
    if (!this.githubToken) {
      console.warn('GitHub token not available - using local data')
      return this.loadLocalVocabulary()
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/contents/${this.VOCABULARY_PATH}`,
        {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      )

      if (response.ok) {
        const fileData = await response.json()
        const content = atob(fileData.content.replace(/\s/g, ''))
        const words = JSON.parse(content)
        
        // Convert date strings back to Date objects
        return words.map((word: any) => ({
          ...word,
          createdAt: new Date(word.createdAt),
          nextReview: new Date(word.nextReview),
          lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : undefined,
        }))
      } else {
        console.warn('Failed to load from GitHub, using local fallback')
        return this.loadLocalVocabulary()
      }
    } catch (error) {
      console.error('GitHub load error:', error)
      return this.loadLocalVocabulary()
    }
  }

  /**
   * Initialize GitHub token from environment or user input
   */
  setGitHubToken(token: string) {
    this.githubToken = token
  }

  /**
   * Check if GitHub integration is available
   */
  isGitHubAvailable(): boolean {
    return !!this.githubToken
  }
}

// Singleton instance
export const githubDataManager = new GitHubDataManager(
  process.env.NEXT_PUBLIC_GITHUB_TOKEN
)