# 🧠 WordMemory - Always-On Vocabulary Learning

> **Enterprise-grade vocabulary learning app with spaced repetition, running locally and always available.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 **One-Click Deploy**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/timurael/newwords)

**Get your own WordMemory app live in 30 seconds!**

## ✨ Features

### Core Functionality
- **🧠 FSRS Algorithm**: Advanced spaced repetition that adapts to your learning patterns
- **🌍 Multi-language Support**: Turkish and German translations
- **📊 Smart Analytics**: Track progress, retention rates, and study streaks
- **🏷️ Auto-tagging**: Automatic categorization by date and difficulty
- **📱 Beautiful UI**: Built with Tailwind CSS, Shadcn UI, and Aceternity UI

### Study Experience
- **📚 Daily Reviews**: Optimized study queue based on memory science
- **🎯 4-Point Rating**: Again, Hard, Good, Easy feedback system
- **✨ Animated Cards**: Smooth, engaging study interface with sparkle effects
- **📈 Progress Tracking**: Visual progress bars and completion stats

## 🚀 Quick Start

### One-Command Setup (Always-On)
```bash
# Install and start the always-on system
./scripts/install-always-on.sh

# Or use the simple command
./wordmemory
```

### Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🎮 Always-On Commands

### Main Control Panel
```bash
./wordmemory          # Interactive control panel
```

### Quick Commands
```bash
./wordmemory start    # Start server
./wordmemory stop     # Stop server  
./wordmemory status   # Check status
./wordmemory open     # Open in browser
./wordmemory logs     # View live logs
```

### Shell Aliases (after installation)
```bash
wordmemory      # Control panel
wm-start        # Start server
wm-stop         # Stop server
wm-status       # Status check
wm-open         # Open browser
wm-logs         # Live logs
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** for accessible components
- **Aceternity UI** for beautiful effects
- **Framer Motion** for animations

### State Management
- **Zustand** with persistence for local state
- **FSRS Algorithm** implementation for optimal spaced repetition

### UI Components
- **Floating Navigation** with scroll detection
- **Background Gradients** and sparkle effects
- **Responsive Cards** with glassmorphism design
- **Progress Indicators** and animated feedback

## 📖 Usage

### Adding Words
1. Click the floating ➕ button
2. Enter the original word
3. Add Turkish and German translations
4. Optionally add notes
5. Click "Add Word"

### Studying
1. Go to `/study` or click "Start Study Session"
2. View the word and try to recall the translation
3. Click "Show Answer" to reveal translations
4. Rate your performance:
   - **Again**: Didn't remember (10 min)
   - **Hard**: Difficult recall (+20% interval)
   - **Good**: Normal recall (2x interval)
   - **Easy**: Easy recall (3x interval)

### Dashboard
- View study statistics
- Track learning progress
- See recently added words
- Quick access to all features

## 🧠 FSRS Algorithm

WordMemory implements the Free Spaced Repetition Scheduler (FSRS) algorithm:

- **Difficulty**: Tracks how hard each word is for you
- **Stability**: How long you can remember the word
- **Retrievability**: Current probability of successful recall
- **Adaptive Scheduling**: Learns from your review history

## 🎨 UI Features

### Aceternity UI Components
- **Sparkles**: Animated particle effects
- **Background Gradients**: Smooth animated gradients
- **Floating Navbar**: Scroll-responsive navigation

### Shadcn UI Components
- **Cards**: Clean, accessible card components
- **Buttons**: Consistent button styling with variants
- **Progress**: Animated progress indicators
- **Inputs**: Styled form inputs

## 📱 Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Large buttons and easy navigation
- **Dark/Light Mode**: Automatic theme support
- **PWA-ready**: Installable as mobile app

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── aceternity/        # Aceternity UI components
│   └── features/          # Feature-specific components
├── store/                 # Zustand state management
├── types/                 # TypeScript definitions
└── lib/                   # Utilities and helpers
```

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📊 Performance Optimizations

- **Component Code Splitting**: Lazy loading for better performance
- **Optimized Images**: Next.js Image optimization
- **Bundle Analysis**: Tree shaking and minimal bundles
- **Local Storage**: Persistent state without server calls

## 🎯 Memory Science

Based on proven research:
- **Hermann Ebbinghaus**: Forgetting curve principles
- **SuperMemo Algorithm**: SM-2 foundation with FSRS improvements
- **90%+ Retention**: Target retention rate for optimal learning
- **Spaced Intervals**: Increasing intervals based on memory strength

## 🌟 Future Enhancements

- [ ] Audio pronunciation support
- [ ] Import/export word lists
- [ ] Study streaks and achievements
- [ ] Advanced analytics dashboard
- [ ] Social features and sharing
- [ ] Offline support (PWA)
- [ ] Multiple language pairs
- [ ] Custom study modes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**WordMemory** - Building vocabulary that lasts through the power of spaced repetition and beautiful design.