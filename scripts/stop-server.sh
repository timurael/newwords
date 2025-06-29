#!/bin/bash

# WordMemory Server Stop Script

echo "🛑 Stopping WordMemory server..."

# Check if PID file exists
if [ -f .server.pid ]; then
    PID=$(cat .server.pid)
    
    # Check if process is still running
    if ps -p $PID > /dev/null 2>&1; then
        echo "🔄 Stopping process $PID..."
        kill $PID
        rm .server.pid
        echo "✅ Server stopped successfully!"
    else
        echo "⚠️  Process $PID not found (may have already stopped)"
        rm .server.pid
    fi
else
    echo "⚠️  No server PID file found"
    
    # Try to kill any running Next.js processes
    PIDS=$(ps aux | grep -E "next dev|next-server" | grep -v grep | awk '{print $2}')
    if [ ! -z "$PIDS" ]; then
        echo "🔄 Found running Next.js processes, stopping them..."
        echo $PIDS | xargs kill
        echo "✅ Stopped running processes"
    else
        echo "ℹ️  No running Next.js processes found"
    fi
fi