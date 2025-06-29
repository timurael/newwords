#!/bin/bash

# WordMemory Persistent Development Server Script
# This keeps your server running even if terminal closes

echo "🚀 Starting WordMemory in persistent mode..."

# Check if already running
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Server already running on port 3000"
    echo "📱 Open: http://localhost:3000"
    exit 1
fi

# Start in background with nohup (no hang up)
echo "🔄 Starting development server..."
nohup npm run dev > wordmemory.log 2>&1 &

# Get the process ID
SERVER_PID=$!
echo $SERVER_PID > .server.pid

echo "✅ WordMemory server started!"
echo "📱 URL: http://localhost:3000"
echo "🆔 Process ID: $SERVER_PID"
echo "📝 Logs: tail -f wordmemory.log"
echo ""
echo "To stop: ./scripts/stop-server.sh"