#!/bin/bash

# WordMemory One-Click Deployment Script
# Deploy your app to the cloud in 2 minutes!

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_color() {
    echo -e "${1}$2${NC}"
}

print_banner() {
    print_color "$PURPLE" "\n======================================"
    print_color "$BLUE" "  🚀 WordMemory Cloud Deployment 🌐  "
    print_color "$PURPLE" "======================================"
}

# Check if Vercel is installed
check_vercel() {
    if ! command -v vercel &> /dev/null; then
        print_color "$YELLOW" "📦 Installing Vercel CLI..."
        npm install -g vercel
    else
        print_color "$GREEN" "✅ Vercel CLI already installed"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_color "$BLUE" "\n🚀 Deploying to Vercel..."
    print_color "$YELLOW" "This will:"
    print_color "$YELLOW" "1. Build your app"
    print_color "$YELLOW" "2. Deploy to global CDN"
    print_color "$YELLOW" "3. Give you a permanent URL"
    
    echo
    read -p "Continue with Vercel deployment? (Y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_color "$YELLOW" "Deployment cancelled."
        return
    fi
    
    # Check if logged in
    if ! vercel whoami &> /dev/null; then
        print_color "$BLUE" "🔑 Please login to Vercel..."
        vercel login
    fi
    
    # Deploy
    print_color "$GREEN" "🚀 Deploying..."
    vercel --prod
    
    print_color "$GREEN" "\n✅ Deployment complete!"
    print_color "$BLUE" "Your app is now live and always accessible!"
}

# Deploy to Netlify
deploy_netlify() {
    print_color "$BLUE" "\n🚀 Netlify Deployment Instructions:"
    print_color "$YELLOW" "1. Go to https://netlify.com"
    print_color "$YELLOW" "2. Click 'Add new site' → 'Import from Git'"
    print_color "$YELLOW" "3. Connect GitHub repo: https://github.com/timurael/newwords"
    print_color "$YELLOW" "4. Build command: npm run build"
    print_color "$YELLOW" "5. Publish directory: .next"
    print_color "$YELLOW" "6. Click Deploy!"
    
    print_color "$GREEN" "\n🌐 Your app will be at: https://wordmemory-[random].netlify.app"
}

# Deploy to Railway
deploy_railway() {
    print_color "$BLUE" "\n🚀 Railway Deployment Instructions:"
    print_color "$YELLOW" "1. Go to https://railway.app"
    print_color "$YELLOW" "2. Sign up with GitHub"
    print_color "$YELLOW" "3. New Project → Deploy from GitHub"
    print_color "$YELLOW" "4. Select: timurael/newwords"
    print_color "$YELLOW" "5. Railway auto-deploys!"
    
    print_color "$GREEN" "\n🌐 Your app will be at: https://wordmemory-production.up.railway.app"
}

# Show all options
show_options() {
    print_color "$CYAN" "\n🎯 Deployment Options:"
    print_color "$WHITE" "   [1] 🚀 Vercel (Recommended - 2 minutes)"
    print_color "$WHITE" "   [2] 🔵 Netlify (Manual setup)"
    print_color "$WHITE" "   [3] 🟣 Railway (Premium features)"
    print_color "$WHITE" "   [4] 📜 View full deployment guide"
    print_color "$WHITE" "   [0] 🚪 Exit"
    print_color "$YELLOW" "\nChoose deployment option: "
}

# Main menu
main() {
    print_banner
    
    print_color "$GREEN" "Your WordMemory app is ready for cloud deployment!"
    print_color "$BLUE" "Get a permanent URL that's always accessible."
    
    while true; do
        show_options
        read -r choice
        
        case $choice in
            1)
                check_vercel
                deploy_vercel
                break
                ;;
            2)
                deploy_netlify
                ;;
            3)
                deploy_railway
                ;;
            4)
                print_color "$BLUE" "\n📜 Opening deployment guide..."
                cat DEPLOYMENT.md
                ;;
            0)
                print_color "$GREEN" "\n👋 Goodbye!"
                exit 0
                ;;
            *)
                print_color "$RED" "\n❌ Invalid choice. Please try again."
                ;;
        esac
        
        echo
        read -p "Press Enter to continue..."
    done
}

# Run main function
main "$@"