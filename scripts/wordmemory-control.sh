#!/bin/bash

# WordMemory Control Panel
# Easy-to-use interface for managing the always-on server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DAEMON_SCRIPT="$SCRIPT_DIR/wordmemory-daemon.sh"
APP_DIR="$(dirname "$SCRIPT_DIR")"
STATUS_FILE="$APP_DIR/.wordmemory-status.json"
LOG_DIR="$APP_DIR/logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Print colored output
print_color() {
    local color="$1"
    shift
    echo -e "${color}$*${NC}"
}

# Print banner
print_banner() {
    print_color "$PURPLE" "\n=================================================="
    print_color "$CYAN" "    🧠 WordMemory Always-On Control Panel 🚀    "
    print_color "$PURPLE" "=================================================="
}

# Show status with nice formatting
show_detailed_status() {
    print_banner
    
    if [ -f "$STATUS_FILE" ]; then
        local status=$(jq -r '.status' "$STATUS_FILE" 2>/dev/null || echo "unknown")
        local pid=$(jq -r '.pid' "$STATUS_FILE" 2>/dev/null || echo "")
        local port=$(jq -r '.port' "$STATUS_FILE" 2>/dev/null || echo "")
        local uptime=$(jq -r '.uptime' "$STATUS_FILE" 2>/dev/null || echo "")
        local last_updated=$(jq -r '.last_updated' "$STATUS_FILE" 2>/dev/null || echo "")
        
        case "$status" in
            "running")
                print_color "$GREEN" "✅ Status: RUNNING"
                print_color "$WHITE" "🔗 URL: http://localhost:$port"
                print_color "$WHITE" "🆔 PID: $pid"
                if [ "$uptime" != "null" ] && [ -n "$uptime" ]; then
                    local hours=$((uptime / 3600))
                    local minutes=$(((uptime % 3600) / 60))
                    local seconds=$((uptime % 60))
                    print_color "$WHITE" "⏱️  Uptime: ${hours}h ${minutes}m ${seconds}s"
                fi
                print_color "$WHITE" "📅 Last Updated: $last_updated"
                
                # Test connection
                if curl -sf "http://localhost:$port" > /dev/null 2>&1; then
                    print_color "$GREEN" "🌐 Connection: HEALTHY"
                else
                    print_color "$RED" "🌐 Connection: UNHEALTHY"
                fi
                ;;
            "stopped")
                print_color "$YELLOW" "⏹️  Status: STOPPED"
                ;;
            "failed")
                print_color "$RED" "❌ Status: FAILED"
                ;;
            *)
                print_color "$RED" "❓ Status: UNKNOWN"
                ;;
        esac
    else
        print_color "$RED" "❌ Status: NOT RUNNING"
    fi
    
    # Show recent logs
    if [ -f "$LOG_DIR/daemon.log" ]; then
        print_color "$BLUE" "\n📋 Recent Activity:"
        tail -n 5 "$LOG_DIR/daemon.log" | while read -r line; do
            print_color "$WHITE" "   $line"
        done
    fi
    
    print_color "$PURPLE" "\n=================================================="
}

# Interactive menu
show_menu() {
    print_color "$CYAN" "\n🎯 Available Commands:"
    print_color "$WHITE" "   [1] 🚀 Start Server (Always-On)"
    print_color "$WHITE" "   [2] ⏹️  Stop Server"
    print_color "$WHITE" "   [3] 🔄 Restart Server"
    print_color "$WHITE" "   [4] 📊 Show Detailed Status"
    print_color "$WHITE" "   [5] 🩺 Health Check"
    print_color "$WHITE" "   [6] 📜 View Live Logs"
    print_color "$WHITE" "   [7] 🖥️  View Server Logs"
    print_color "$WHITE" "   [8] 🌐 Open in Browser"
    print_color "$WHITE" "   [9] 🛠️  System Information"
    print_color "$WHITE" "   [0] 🚪 Exit"
    print_color "$YELLOW" "\nEnter your choice: "
}

# System information
show_system_info() {
    print_color "$BLUE" "\n🖥️  System Information:"
    print_color "$WHITE" "   📁 App Directory: $APP_DIR"
    print_color "$WHITE" "   📂 Log Directory: $LOG_DIR"
    print_color "$WHITE" "   🐧 OS: $(uname -s)"
    print_color "$WHITE" "   🏗️  Architecture: $(uname -m)"
    print_color "$WHITE" "   🟢 Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
    print_color "$WHITE" "   📦 npm: $(npm --version 2>/dev/null || echo 'Not installed')"
    
    # Check if Next.js is installed
    if [ -f "$APP_DIR/package.json" ]; then
        local next_version=$(cd "$APP_DIR" && npm list next --depth=0 2>/dev/null | grep next | cut -d'@' -f2 || echo 'Not found')
        print_color "$WHITE" "   ⚡ Next.js: $next_version"
    fi
    
    # Disk space
    local disk_usage=$(df -h "$APP_DIR" | tail -1 | awk '{print $5}')
    print_color "$WHITE" "   💾 Disk Usage: $disk_usage"
    
    # Memory usage
    local memory_usage=$(ps aux | grep '[n]ext dev' | awk '{sum+=$6} END {printf "%.1f MB\n", sum/1024}' 2>/dev/null || echo "0 MB")
    print_color "$WHITE" "   🧠 Memory Usage: $memory_usage"
}

# Open in browser
open_browser() {
    local port="3000"
    if [ -f "$STATUS_FILE" ]; then
        port=$(jq -r '.port' "$STATUS_FILE" 2>/dev/null || echo "3000")
    fi
    
    local url="http://localhost:$port"
    print_color "$GREEN" "🌐 Opening $url in browser..."
    
    # Detect OS and open browser
    case "$(uname -s)" in
        Darwin)
            open "$url"
            ;;
        Linux)
            xdg-open "$url" 2>/dev/null || sensible-browser "$url" 2>/dev/null || firefox "$url" 2>/dev/null
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*)
            start "$url"
            ;;
        *)
            print_color "$YELLOW" "Please open $url in your browser"
            ;;
    esac
}

# Quick actions without menu
case "${1:-menu}" in
    start)
        print_banner
        print_color "$GREEN" "🚀 Starting WordMemory Always-On Server..."
        "$DAEMON_SCRIPT" start
        ;;
    stop)
        print_banner
        print_color "$YELLOW" "⏹️  Stopping WordMemory Server..."
        "$DAEMON_SCRIPT" stop
        ;;
    restart)
        print_banner
        print_color "$BLUE" "🔄 Restarting WordMemory Server..."
        "$DAEMON_SCRIPT" restart
        ;;
    status)
        show_detailed_status
        ;;
    health)
        print_banner
        "$DAEMON_SCRIPT" health
        ;;
    logs)
        print_banner
        print_color "$BLUE" "📜 Showing live logs (Ctrl+C to exit)..."
        "$DAEMON_SCRIPT" logs
        ;;
    open)
        open_browser
        ;;
    info)
        show_system_info
        ;;
    menu|*)
        # Interactive menu mode
        while true; do
            show_detailed_status
            show_menu
            
            read -r choice
            
            case $choice in
                1)
                    print_color "$GREEN" "🚀 Starting server..."
                    "$DAEMON_SCRIPT" start
                    print_color "$GREEN" "\n✅ Startup command sent. Check status above."
                    sleep 2
                    ;;
                2)
                    print_color "$YELLOW" "⏹️  Stopping server..."
                    "$DAEMON_SCRIPT" stop
                    print_color "$YELLOW" "\n✅ Stop command sent."
                    sleep 2
                    ;;
                3)
                    print_color "$BLUE" "🔄 Restarting server..."
                    "$DAEMON_SCRIPT" restart &
                    print_color "$BLUE" "\n✅ Restart command sent."
                    sleep 2
                    ;;
                4)
                    # Status already shown at top of loop
                    print_color "$CYAN" "\n📊 Status refreshed."
                    sleep 2
                    ;;
                5)
                    print_color "$CYAN" "🩺 Running health check..."
                    "$DAEMON_SCRIPT" health
                    print_color "$CYAN" "\nPress Enter to continue..."
                    read -r
                    ;;
                6)
                    print_color "$BLUE" "📜 Showing live logs (Ctrl+C to return to menu)..."
                    "$DAEMON_SCRIPT" logs
                    ;;
                7)
                    print_color "$BLUE" "🖥️  Showing server logs (Ctrl+C to return to menu)..."
                    "$DAEMON_SCRIPT" server-logs
                    ;;
                8)
                    open_browser
                    sleep 1
                    ;;
                9)
                    show_system_info
                    print_color "$CYAN" "\nPress Enter to continue..."
                    read -r
                    ;;
                0)
                    print_color "$GREEN" "\n👋 Goodbye!"
                    exit 0
                    ;;
                *)
                    print_color "$RED" "\n❌ Invalid choice. Please try again."
                    sleep 1
                    ;;
            esac
        done
        ;;
esac