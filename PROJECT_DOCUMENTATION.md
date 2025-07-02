# WordMemory Project Documentation

## Project Overview
WordMemory is a sophisticated vocabulary learning application built with Next.js that helps users learn and retain words across multiple languages using scientifically-proven spaced repetition algorithms.

**Live URL**: https://nwordx.netlify.com

## Technical Stack
- **Framework**: Next.js 15.1.6 (Static Site Generation)
- **Language**: TypeScript 5
- **State Management**: Zustand with persist middleware
- **Styling**: Tailwind CSS
- **Storage**: Client-side only (localStorage + IndexedDB)
- **Algorithm**: Free Spaced Repetition Scheduler (FSRS)
- **Deployment**: Netlify (primary) and Vercel

## Core Features

### 1. Multi-Language Word Management
- Support for three languages per word entry:
  - Original word (any language)
  - Turkish translation
  - German translation
- Tags for categorization
- Notes and example sentences
- Difficulty ratings (0-10)

### 2. Spaced Repetition Learning
- FSRS algorithm implementation for optimal retention
- Automatic scheduling of review sessions
- Adaptive difficulty based on performance
- Memory strength tracking (retrievability)
- State-based learning progression:
  - New → Learning → Review → Relearning

### 3. Data Persistence (Current Implementation)
- **Primary Storage**: Zustand store with localStorage
  - Key: `word-store`
  - Automatic serialization/deserialization
  - Date object preservation
- **Backup System**: Multi-layer redundancy
  - IndexedDB for large datasets (50 auto-backups)
  - localStorage compression (10 backups)
  - Manual export to JSON/CSV files
  - Automatic backups on data changes
  - Data integrity checks with checksums

### 4. User Interface
- **Pages**:
  - Landing page with quick stats
  - Dashboard with comprehensive statistics
  - Study page for spaced repetition practice
  - Words list with search and filtering
  - Interactive word map visualization
  - Progress tracking with charts
- **Features**:
  - Floating word bubbles animation
  - Dark mode support
  - Responsive design
  - Keyboard shortcuts
  - Real-time search

## Current Limitations

### Data Persistence Across Browsers/Devices
The application currently stores all data locally in the browser, which means:
- **No cross-browser sync**: Data added in Chrome won't appear in Firefox
- **No cross-device sync**: Data on your phone won't sync to your laptop
- **No user accounts**: Each browser instance is independent
- **Data loss risk**: Clearing browser data removes all words

### Why This Happens
1. **localStorage** is browser-specific and domain-specific
2. **IndexedDB** is also confined to the browser instance
3. No backend server to sync data between clients
4. No authentication system to identify users

## Architecture Details

### Data Flow
```
User Input → Zustand Store → localStorage → IndexedDB Backup
     ↓             ↓              ↓              ↓
React UI ← useWordStore() ← Rehydration ← Backup Recovery
```

### Key Components
- **Store** (`/src/store/index.ts`): Central state management
- **Backup** (`/src/lib/backup.ts`): Enterprise-grade backup system
- **FSRS** (`/src/lib/fsrs.ts`): Spaced repetition algorithm
- **Components**: Modular UI components in `/src/components`

### Storage Schema
```typescript
// Zustand Store Structure
{
  words: Word[],
  stats: {
    totalWords: number,
    wordsLearnedToday: number,
    streak: number,
    lastStudyDate: Date | null
  }
}

// IndexedDB Structure
Database: WordMemoryBackup
├── backups (store)
│   ├── id: string
│   ├── timestamp: Date
│   ├── data: compressed JSON
│   └── checksum: string
└── metadata (store)
    └── lastBackup: Date
```

## Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static site
npm run export
```

## Deployment
The project uses static site generation and can be deployed to any static hosting service:
- **Netlify**: Primary deployment with automatic builds
- **Vercel**: Alternative deployment option
- **GitHub Pages**: Possible with the `/out` directory

## Future Enhancement Opportunities

### 1. User Authentication
- Add user accounts for data ownership
- OAuth integration (Google, GitHub)
- JWT token management
- User profile storage

### 2. Backend Integration
- RESTful API or GraphQL endpoint
- Database storage (PostgreSQL, MongoDB)
- Real-time sync with WebSockets
- Conflict resolution for concurrent edits

### 3. Progressive Web App
- Service worker for offline functionality
- Push notifications for review reminders
- Install prompts for mobile devices
- Background sync capabilities

### 4. Advanced Features
- Collaborative word lists
- Community sharing of word sets
- Audio pronunciation
- Image associations
- Gamification elements

## Security Considerations
- All data is currently client-side (no server security needed)
- No sensitive data transmission
- Export files are unencrypted JSON/CSV
- No user authentication means no access control

## Performance Metrics
- **Initial Load**: ~200KB JavaScript bundle
- **Storage Limit**: ~10MB localStorage, ~50MB+ IndexedDB
- **Backup Frequency**: After each data mutation
- **Max Words**: Theoretically unlimited (practically ~10,000 for good performance)