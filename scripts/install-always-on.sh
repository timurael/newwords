#!/bin/bash

# WordMemory Always-On Installer
# Sets up the system for persistent local server operation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
SERVICE_NAME="wordmemory"
USER_HOME="$HOME"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_color() {
    echo -e "${1}$2${NC}"
}

print_banner() {
    print_color "$PURPLE" "\n========================================================"
    print_color "$BLUE" "    🏗️  WordMemory Always-On Installation 🚀"
    print_color "$PURPLE" "========================================================"
}

# Check system requirements
check_requirements() {
    print_color "$BLUE" "\n🔍 Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_color "$RED" "❌ Node.js is not installed"
        print_color "$YELLOW" "Please install Node.js from https://nodejs.org/"
        exit 1
    else
        local node_version=$(node --version)
        print_color "$GREEN" "✅ Node.js: $node_version"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_color "$RED" "❌ npm is not installed"
        exit 1
    else
        local npm_version=$(npm --version)
        print_color "$GREEN" "✅ npm: $npm_version"
    fi
    
    # Check if in correct directory
    if [ ! -f "$APP_DIR/package.json" ]; then
        print_color "$RED" "❌ Not in WordMemory project directory"
        print_color "$YELLOW" "Please run this script from the WordMemory project root"
        exit 1
    fi
    
    print_color "$GREEN" "✅ All requirements met"
}

# Install dependencies
install_dependencies() {
    print_color "$BLUE" "\n📦 Installing project dependencies..."
    
    cd "$APP_DIR" || exit 1
    
    if npm install; then
        print_color "$GREEN" "✅ Dependencies installed successfully"
    else
        print_color "$RED" "❌ Failed to install dependencies"
        exit 1
    fi
}

# Setup directories and permissions
setup_directories() {
    print_color "$BLUE" "\n📁 Setting up directories..."
    
    # Create logs directory
    mkdir -p "$APP_DIR/logs"
    
    # Make scripts executable
    chmod +x "$SCRIPT_DIR"/*.sh
    
    print_color "$GREEN" "✅ Directories and permissions configured"
}

# Create system service (macOS LaunchAgent)
create_macos_service() {
    print_color "$BLUE" "\n🍎 Setting up macOS LaunchAgent..."
    
    local plist_dir="$USER_HOME/Library/LaunchAgents"
    local plist_file="$plist_dir/com.wordmemory.daemon.plist"
    
    mkdir -p "$plist_dir"
    
    cat > "$plist_file" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.wordmemory.daemon</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>$SCRIPT_DIR/wordmemory-daemon.sh</string>
        <string>start</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>$APP_DIR</string>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
        <key>Crashed</key>
        <true/>
    </dict>
    
    <key>StandardOutPath</key>
    <string>$APP_DIR/logs/launchd.out.log</string>
    
    <key>StandardErrorPath</key>
    <string>$APP_DIR/logs/launchd.error.log</string>
    
    <key>ThrottleInterval</key>
    <integer>10</integer>
    
    <key>ProcessType</key>
    <string>Background</string>
    
    <key>Nice</key>
    <integer>1</integer>
</dict>
</plist>
EOF
    
    print_color "$GREEN" "✅ LaunchAgent created: $plist_file"
    
    # Load the service
    if launchctl load "$plist_file" 2>/dev/null; then
        print_color "$GREEN" "✅ LaunchAgent loaded successfully"
    else
        print_color "$YELLOW" "⚠️  LaunchAgent will be loaded on next login"
    fi
}

# Create system service (Linux systemd)
create_linux_service() {
    print_color "$BLUE" "\n🐧 Setting up Linux systemd service..."
    
    local service_dir="$USER_HOME/.config/systemd/user"
    local service_file="$service_dir/wordmemory.service"
    
    mkdir -p "$service_dir"
    
    cat > "$service_file" <<EOF
[Unit]
Description=WordMemory Always-On Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=$SCRIPT_DIR/wordmemory-daemon.sh start
ExecStop=$SCRIPT_DIR/wordmemory-daemon.sh stop
Restart=always
RestartSec=10
StandardOutput=append:$APP_DIR/logs/systemd.out.log
StandardError=append:$APP_DIR/logs/systemd.error.log
Environment=NODE_ENV=development
Environment=PORT=3000

[Install]
WantedBy=default.target
EOF
    
    print_color "$GREEN" "✅ Systemd service created: $service_file"
    
    # Reload systemd and enable service
    systemctl --user daemon-reload
    systemctl --user enable wordmemory.service
    
    print_color "$GREEN" "✅ Service enabled for autostart"
}

# Create shell aliases and shortcuts
create_shortcuts() {
    print_color "$BLUE" "\n⚙️  Creating command shortcuts..."
    
    local alias_file="$USER_HOME/.wordmemory_aliases"
    
    cat > "$alias_file" <<EOF
# WordMemory Always-On Shortcuts
# Add this to your ~/.bashrc or ~/.zshrc:
# source ~/.wordmemory_aliases

# Main control panel
alias wordmemory='$SCRIPT_DIR/wordmemory-control.sh'
alias wm='$SCRIPT_DIR/wordmemory-control.sh'

# Quick commands
alias wm-start='$SCRIPT_DIR/wordmemory-control.sh start'
alias wm-stop='$SCRIPT_DIR/wordmemory-control.sh stop'
alias wm-restart='$SCRIPT_DIR/wordmemory-control.sh restart'
alias wm-status='$SCRIPT_DIR/wordmemory-control.sh status'
alias wm-logs='$SCRIPT_DIR/wordmemory-control.sh logs'
alias wm-open='$SCRIPT_DIR/wordmemory-control.sh open'

# Development shortcuts
alias wm-health='$SCRIPT_DIR/wordmemory-daemon.sh health'
alias wm-info='$SCRIPT_DIR/wordmemory-control.sh info'
EOF
    
    print_color "$GREEN" "✅ Shortcuts created: $alias_file"
    
    # Try to add to shell profile
    local shell_profile=""
    if [ -f "$USER_HOME/.zshrc" ]; then
        shell_profile="$USER_HOME/.zshrc"
    elif [ -f "$USER_HOME/.bashrc" ]; then
        shell_profile="$USER_HOME/.bashrc"
    elif [ -f "$USER_HOME/.bash_profile" ]; then
        shell_profile="$USER_HOME/.bash_profile"
    fi
    
    if [ -n "$shell_profile" ]; then
        if ! grep -q "wordmemory_aliases" "$shell_profile"; then
            echo "" >> "$shell_profile"
            echo "# WordMemory Always-On Shortcuts" >> "$shell_profile"
            echo "source ~/.wordmemory_aliases" >> "$shell_profile"
            print_color "$GREEN" "✅ Shortcuts added to $shell_profile"
        else
            print_color "$YELLOW" "⚠️  Shortcuts already in $shell_profile"
        fi
    fi
}

# Setup startup script
setup_startup() {
    print_color "$BLUE" "\n🚀 Setting up automatic startup..."
    
    case "$(uname -s)" in
        Darwin)
            create_macos_service
            ;;
        Linux)
            create_linux_service
            ;;
        *)
            print_color "$YELLOW" "⚠️  Automatic startup not supported on this platform"
            print_color "$YELLOW" "You can manually start with: $SCRIPT_DIR/wordmemory-control.sh start"
            ;;
    esac
}

# Main installation
main() {
    print_banner
    
    print_color "$BLUE" "This will set up WordMemory to run always-on locally."
    print_color "$YELLOW" "\nFeatures:"
    print_color "$YELLOW" "• Automatic server restart on failure"
    print_color "$YELLOW" "• Health monitoring every 30 seconds"
    print_color "$YELLOW" "• Comprehensive logging"
    print_color "$YELLOW" "• Easy control panel interface"
    print_color "$YELLOW" "• System service integration"
    
    echo
    read -p "Continue with installation? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_color "$YELLOW" "Installation cancelled."
        exit 0
    fi
    
    check_requirements
    install_dependencies
    setup_directories
    create_shortcuts
    setup_startup
    
    print_color "$GREEN" "\n✅ Installation completed successfully!"
    
    print_color "$BLUE" "\n🎆 What's next:"
    print_color "$YELLOW" "1. Restart your terminal or run: source ~/.wordmemory_aliases"
    print_color "$YELLOW" "2. Start WordMemory: wordmemory start"
    print_color "$YELLOW" "3. Open control panel: wordmemory"
    print_color "$YELLOW" "4. Access your app: http://localhost:3000"
    
    print_color "$BLUE" "\n🚀 Quick commands:"
    print_color "$WHITE" "  wordmemory       # Open control panel"
    print_color "$WHITE" "  wm-start         # Start server"
    print_color "$WHITE" "  wm-status        # Check status"
    print_color "$WHITE" "  wm-open          # Open in browser"
    
    # Ask if user wants to start now
    echo
    read -p "Start WordMemory now? (Y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_color "$YELLOW" "WordMemory ready but not started. Run 'wordmemory start' when ready."
    else
        print_color "$GREEN" "🚀 Starting WordMemory..."
        "$SCRIPT_DIR/wordmemory-control.sh" start
        sleep 3
        "$SCRIPT_DIR/wordmemory-control.sh" status
    fi
}

# Run main function
main "$@"