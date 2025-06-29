#!/bin/bash

# WordMemory Auto-Restarting Server
# Keeps server always running with automatic restarts

LOGFILE="wordmemory-auto.log"
PIDFILE=".auto-server.pid"
MAX_RESTARTS=10
RESTART_COUNT=0

echo "🚀 Starting WordMemory Auto-Server..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down auto-server..."
    if [ -f $PIDFILE ]; then
        PID=$(cat $PIDFILE)
        kill $PID 2>/dev/null
        rm $PIDFILE
    fi
    pkill -f "npm run dev" 2>/dev/null
    exit 0
}

# Trap signals
trap cleanup SIGTERM SIGINT

# Function to start the server
start_server() {
    echo "$(date): Starting server (attempt $((RESTART_COUNT + 1)))" >> $LOGFILE
    npm run dev >> $LOGFILE 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > $PIDFILE
    echo "✅ Server started with PID: $SERVER_PID"
}

# Function to check if server is running
is_server_running() {
    if [ -f $PIDFILE ]; then
        PID=$(cat $PIDFILE)
        if ps -p $PID > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Function to check if port 3000 is responsive
is_port_responsive() {
    curl -s http://localhost:3000 > /dev/null 2>&1
    return $?
}

echo "🔧 Auto-server configuration:"
echo "   📝 Log file: $LOGFILE"
echo "   🆔 PID file: $PIDFILE"
echo "   🔄 Max restarts: $MAX_RESTARTS"
echo "   📱 URL: http://localhost:3000"
echo ""

# Start initial server
start_server

# Monitor loop
while true; do
    sleep 10
    
    # Check if server process is still running
    if ! is_server_running; then
        echo "⚠️  Server process died, restarting..."
        RESTART_COUNT=$((RESTART_COUNT + 1))
        
        if [ $RESTART_COUNT -gt $MAX_RESTARTS ]; then
            echo "❌ Max restarts ($MAX_RESTARTS) reached. Stopping auto-server."
            echo "💡 Check logs: tail -f $LOGFILE"
            exit 1
        fi
        
        start_server
        continue
    fi
    
    # Check if port is responsive
    if ! is_port_responsive; then
        echo "⚠️  Port 3000 not responsive, restarting server..."
        kill $(cat $PIDFILE) 2>/dev/null
        rm $PIDFILE 2>/dev/null
        RESTART_COUNT=$((RESTART_COUNT + 1))
        
        if [ $RESTART_COUNT -gt $MAX_RESTARTS ]; then
            echo "❌ Max restarts ($MAX_RESTARTS) reached. Stopping auto-server."
            exit 1
        fi
        
        sleep 5
        start_server
        continue
    fi
    
    # Reset restart count if server has been stable for 5 minutes
    if [ $RESTART_COUNT -gt 0 ]; then
        SERVER_UPTIME=$(ps -o etime= -p $(cat $PIDFILE) 2>/dev/null | tr -d ' ')
        if [[ $SERVER_UPTIME =~ ^[0-9][0-9]:[0-9][0-9]$ ]] && [ ${SERVER_UPTIME:0:2} -ge 05 ]; then
            echo "✅ Server stable for 5+ minutes, resetting restart count"
            RESTART_COUNT=0
        fi
    fi
done