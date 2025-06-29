# 🚀 WordMemory Deployment Guide

## 📱 **Current Status**
Your app is running at: **http://localhost:3000**

## 🏠 **Local Development Options**

### Option 1: Current Terminal Session
```bash
npm run dev  # Stops when terminal closes
```

### Option 2: Persistent Background (Recommended)
```bash
# Start persistent server
./scripts/start-persistent.sh

# Check status
./scripts/status.sh

# View logs
tail -f wordmemory.log

# Stop server
./scripts/stop-server.sh
```

### Option 3: Using PM2 (Advanced)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "wordmemory" -- run dev

# Check status
pm2 status

# Stop
pm2 stop wordmemory
```

## 🌐 **Production Deployment Options**

### 1. **Vercel (Recommended - Free)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (first time)
vercel

# Subsequent deployments
vercel --prod
```
**Benefits:**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Global CDN
- ✅ Custom domains
- ✅ Perfect for Next.js

### 2. **Netlify (Alternative Free Option)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

### 3. **Railway (Simple Paid)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### 4. **DigitalOcean App Platform**
- Connect GitHub repository
- Auto-deploys on code changes
- $5/month starting cost

## 🔧 **Making It Always Available**

### For Development (Local Network Access)
```bash
# Edit package.json scripts
"dev": "next dev -H 0.0.0.0"

# Now accessible at:
# http://localhost:3000        (your computer)
# http://YOUR_IP:3000          (other devices on network)
```

### For Production (Internet Access)
1. **Deploy to Vercel** (easiest)
2. **Set up custom domain** (optional)
3. **Configure environment variables** (if needed)

## 📦 **Production Build Process**

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start

# Deploy build to production
# (varies by platform)
```

## 🔐 **Environment Setup**

Create `.env.local` for local development:
```bash
# .env.local
NEXT_PUBLIC_APP_NAME="WordMemory"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 🚨 **Common Issues & Solutions**

### Server Keeps Stopping
- **Problem**: Terminal closes → server stops
- **Solution**: Use `./scripts/start-persistent.sh`

### Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 PID_NUMBER

# Or use different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

## 💡 **Recommendations**

### For Learning/Development:
1. Use `./scripts/start-persistent.sh`
2. Access at `http://localhost:3000`

### For Sharing with Others:
1. Deploy to **Vercel** (free)
2. Get public URL like `wordmemory.vercel.app`

### For Production App:
1. Custom domain
2. Environment variables
3. Analytics/monitoring
4. Database (if needed later)

## 🎯 **Quick Start Commands**

```bash
# Check current status
./scripts/status.sh

# Start persistent server
./scripts/start-persistent.sh

# Deploy to Vercel
npx vercel

# Open in browser
open http://localhost:3000
```