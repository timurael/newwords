#!/bin/bash

# WordMemory Server Status Script

echo "📊 WordMemory Server Status"
echo "=========================="

# Check if server is running on port 3000
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Server Status: RUNNING"
    echo "📱 URL: http://localhost:3000"
    
    # Get process details
    PROCESS_INFO=$(lsof -i :3000 | tail -n +2)
    PID=$(echo $PROCESS_INFO | awk '{print $2}')
    echo "🆔 Process ID: $PID"
    
    # Get process start time
    START_TIME=$(ps -p $PID -o lstart= 2>/dev/null)
    if [ ! -z "$START_TIME" ]; then
        echo "🕐 Started: $START_TIME"
    fi
    
    # Check if log file exists
    if [ -f wordmemory.log ]; then
        echo "📝 Log file: wordmemory.log"
        echo "📊 Log size: $(wc -l < wordmemory.log) lines"
    fi
    
else
    echo "❌ Server Status: NOT RUNNING"
    echo "💡 To start: ./scripts/start-persistent.sh"
fi

echo ""
echo "🛠️  Available Commands:"
echo "  ./scripts/start-persistent.sh  - Start server in background"
echo "  ./scripts/stop-server.sh       - Stop server"
echo "  ./scripts/status.sh            - Check status (this script)"
echo "  tail -f wordmemory.log         - Watch logs"