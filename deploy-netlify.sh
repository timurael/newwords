#!/bin/bash

# WordMemory Netlify Deployment Helper
# This script helps you deploy to Netlify

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_color() {
    echo -e "${1}$2${NC}"
}

print_banner() {
    print_color "$PURPLE" "\n========================================"
    print_color "$CYAN" "  🚀 WordMemory Netlify Deployment 🌐  "
    print_color "$PURPLE" "========================================"
}

# Test build locally
test_build() {
    print_color "$BLUE" "\n🔄 Testing build process..."
    
    if npm run build; then
        print_color "$GREEN" "✅ Build successful!"
        print_color "$GREEN" "✅ Static files generated in 'out/' directory"
        
        # Show build size
        local build_size=$(du -sh out/ | cut -f1)
        print_color "$CYAN" "📊 Build size: $build_size"
        
        # Check if index.html exists
        if [ -f "out/index.html" ]; then
            print_color "$GREEN" "✅ Main page generated successfully"
        else
            print_color "$RED" "❌ Main page not found"
            return 1
        fi
        
        return 0
    else
        print_color "$RED" "❌ Build failed!"
        print_color "$YELLOW" "Please fix build errors before deploying"
        return 1
    fi
}

# Show deployment options
show_deployment_options() {
    print_color "$CYAN" "\n🎯 Netlify Deployment Options:"
    print_color "$GREEN" "\n🚀 Option 1: One-Click Deploy (Easiest)"
    print_color "$YELLOW" "   Click this link: https://app.netlify.com/start/deploy?repository=https://github.com/timurael/newwords"
    print_color "$YELLOW" "   1. Connect GitHub account"
    print_color "$YELLOW" "   2. Click 'Deploy site'"
    print_color "$YELLOW" "   3. Done! Your app is live"
    
    print_color "$BLUE" "\n🔗 Option 2: Manual Import"
    print_color "$YELLOW" "   1. Go to netlify.com"
    print_color "$YELLOW" "   2. Click 'Add new site' → 'Import project'"
    print_color "$YELLOW" "   3. Connect GitHub: timurael/newwords"
    print_color "$YELLOW" "   4. Settings auto-detected:"
    print_color "$YELLOW" "      - Build command: npm run build"
    print_color "$YELLOW" "      - Publish directory: out"
    print_color "$YELLOW" "   5. Click 'Deploy'"
    
    print_color "$PURPLE" "\n📱 Option 3: Netlify CLI"
    print_color "$YELLOW" "   1. npm install -g netlify-cli"
    print_color "$YELLOW" "   2. netlify login"
    print_color "$YELLOW" "   3. netlify deploy --prod"
}

# Install Netlify CLI
install_netlify_cli() {
    print_color "$BLUE" "\n📦 Installing Netlify CLI..."
    
    if command -v netlify &> /dev/null; then
        print_color "$GREEN" "✅ Netlify CLI already installed"
        netlify --version
        return 0
    fi
    
    if npm install -g netlify-cli; then
        print_color "$GREEN" "✅ Netlify CLI installed successfully"
        return 0
    else
        print_color "$RED" "❌ Failed to install Netlify CLI"
        print_color "$YELLOW" "Try running: sudo npm install -g netlify-cli"
        return 1
    fi
}

# Deploy with CLI
deploy_with_cli() {
    if ! command -v netlify &> /dev/null; then
        print_color "$YELLOW" "Netlify CLI not found. Installing..."
        if ! install_netlify_cli; then
            return 1
        fi
    fi
    
    print_color "$BLUE" "\n🚀 Deploying with Netlify CLI..."
    
    # Login
    print_color "$YELLOW" "Please login to Netlify..."
    netlify login
    
    # Deploy
    print_color "$GREEN" "Deploying to production..."
    netlify deploy --prod --dir=out
}

# Open deployment links
open_links() {
    print_color "$CYAN" "\n🌐 Opening deployment options..."
    
    # Detect OS and open browser
    case "$(uname -s)" in
        Darwin)
            open "https://app.netlify.com/start/deploy?repository=https://github.com/timurael/newwords"
            open "https://netlify.com"
            ;;
        Linux)
            xdg-open "https://app.netlify.com/start/deploy?repository=https://github.com/timurael/newwords" 2>/dev/null
            ;;
        *)
            print_color "$YELLOW" "Please open these links in your browser:"
            print_color "$CYAN" "1. https://app.netlify.com/start/deploy?repository=https://github.com/timurael/newwords"
            print_color "$CYAN" "2. https://netlify.com"
            ;;
    esac
}

# Show help
show_help() {
    print_color "$CYAN" "\n📚 Usage:"
    print_color "$YELLOW" "  ./deploy-netlify.sh [option]"
    print_color "$YELLOW" "\nOptions:"
    print_color "$YELLOW" "  test     - Test build process"
    print_color "$YELLOW" "  cli      - Deploy using Netlify CLI"
    print_color "$YELLOW" "  open     - Open deployment links"
    print_color "$YELLOW" "  help     - Show this help"
    print_color "$YELLOW" "\nNo option = Show all deployment methods"
}

# Main function
main() {
    print_banner
    
    case "${1:-menu}" in
        test)
            test_build
            ;;
        cli)
            test_build && deploy_with_cli
            ;;
        open)
            open_links
            ;;
        help)
            show_help
            ;;
        menu|*)
            print_color "$GREEN" "WordMemory is ready for Netlify deployment!"
            print_color "$BLUE" "All optimizations are configured and tested."
            
            # Test build first
            if test_build; then
                show_deployment_options
                
                echo
                read -p "Would you like to open the one-click deploy link? (Y/n): " -n 1 -r
                echo
                
                if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                    open_links
                fi
            fi
            ;;
    esac
}

# Run main function
main "$@"