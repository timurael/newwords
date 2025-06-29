#!/bin/bash

# WordMemory Always-On Daemon
# Production-grade local server with automatic restart and monitoring
# Following WordMemory Senior Developer standards

# Configuration
APP_NAME="WordMemory"
APP_DIR="/Users/timoel/newword/newwords"
PORT=${PORT:-3000}
LOG_DIR="$APP_DIR/logs"
PID_FILE="$APP_DIR/.wordmemory-daemon.pid"
LOCK_FILE="$APP_DIR/.wordmemory-daemon.lock"
STATUS_FILE="$APP_DIR/.wordmemory-status.json"
MAX_RESTART_ATTEMPTS=10
RESTART_DELAY=5
HEALTH_CHECK_INTERVAL=30
LOG_RETENTION_DAYS=7

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_DIR/daemon.log"
}

# Status tracking
update_status() {
    local status="$1"
    local pid="$2"
    local port="$3"
    local uptime="$4"
    
    cat > "$STATUS_FILE" <<EOF
{
  "status": "$status",
  "pid": "$pid",
  "port": "$port",
  "uptime": "$uptime",
  "last_updated": "$(date -Iseconds)",
  "app_name": "$APP_NAME",
  "log_file": "$LOG_DIR/daemon.log"
}
EOF
}

# Health check function
health_check() {
    local pid="$1"
    
    # Check if process is running
    if ! kill -0 "$pid" 2>/dev/null; then
        return 1
    fi
    
    # Find actual port being used by checking server logs
    local actual_port=$(grep -o "localhost:[0-9]*" "$LOG_DIR/server.log" 2>/dev/null | tail -1 | cut -d: -f2)
    if [ -n "$actual_port" ]; then
        PORT="$actual_port"
        log "INFO" "Server running on port $PORT"
    fi
    
    # Check if port is responding
    if ! curl -sf "http://localhost:$PORT" > /dev/null 2>&1; then
        return 1
    fi
    
    return 0
}

# Start the Next.js server
start_server() {
    cd "$APP_DIR" || exit 1
    
    log "INFO" "Starting $APP_NAME server on port $PORT"
    
    # Start server in background
    nohup npm run dev > "$LOG_DIR/server.log" 2>&1 &
    local server_pid=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Wait for server to fully start and find actual port
    sleep 5
    local actual_port=$(grep -o "localhost:[0-9]*" "$LOG_DIR/server.log" 2>/dev/null | tail -1 | cut -d: -f2)
    if [ -n "$actual_port" ]; then
        PORT="$actual_port"
        log "INFO" "Server started on port $PORT"
    fi
    
    # Verify server started successfully
    if health_check "$server_pid"; then
        echo "$server_pid" > "$PID_FILE"
        update_status "running" "$server_pid" "$PORT" "0"
        log "INFO" "$APP_NAME server started successfully (PID: $server_pid, Port: $PORT)"
        return 0
    else
        log "ERROR" "Failed to start $APP_NAME server"
        return 1
    fi
}

# Stop the server
stop_server() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log "INFO" "Stopping $APP_NAME server (PID: $pid)"
            kill "$pid"
            sleep 2
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                log "WARN" "Force killing $APP_NAME server"
                kill -9 "$pid"
            fi
        fi
        rm -f "$PID_FILE"
    fi
    
    # Kill any remaining Next.js processes
    pkill -f "next dev" 2>/dev/null || true
    
    update_status "stopped" "" "" ""
    log "INFO" "$APP_NAME server stopped"
}

# Restart the server
restart_server() {
    log "INFO" "Restarting $APP_NAME server"
    stop_server
    sleep 2
    start_server
}

# Monitoring loop
monitor_loop() {
    local restart_count=0
    local start_time=$(date +%s)
    
    log "INFO" "Starting monitoring loop for $APP_NAME"
    
    while true; do
        if [ -f "$PID_FILE" ]; then
            local pid=$(cat "$PID_FILE")
            local current_time=$(date +%s)
            local uptime=$((current_time - start_time))
            
            if health_check "$pid"; then
                # Server is healthy
                update_status "running" "$pid" "$PORT" "$uptime"
                restart_count=0
            else
                # Server is unhealthy
                log "ERROR" "$APP_NAME server health check failed (PID: $pid)"
                
                if [ $restart_count -lt $MAX_RESTART_ATTEMPTS ]; then
                    restart_count=$((restart_count + 1))
                    log "WARN" "Attempting restart $restart_count/$MAX_RESTART_ATTEMPTS"
                    
                    restart_server
                    start_time=$(date +%s)
                    sleep $RESTART_DELAY
                else
                    log "FATAL" "Max restart attempts reached. Stopping daemon."
                    update_status "failed" "" "" ""
                    break
                fi
            fi
        else
            # No PID file, start server
            log "WARN" "No PID file found, starting server"
            start_server
            start_time=$(date +%s)
        fi
        
        sleep $HEALTH_CHECK_INTERVAL
    done
}

# Cleanup function
cleanup() {
    log "INFO" "Cleaning up daemon"
    stop_server
    rm -f "$LOCK_FILE"
    rm -f "$STATUS_FILE"
    exit 0
}

# Log rotation
rotate_logs() {
    find "$LOG_DIR" -name "*.log" -mtime +$LOG_RETENTION_DAYS -delete
    log "INFO" "Log rotation completed"
}

# Signal handlers
trap cleanup SIGTERM SIGINT

# Main daemon function
start_daemon() {
    # Check if daemon is already running
    if [ -f "$LOCK_FILE" ]; then
        local existing_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
        if [ -n "$existing_pid" ] && kill -0 "$existing_pid" 2>/dev/null; then
            log "ERROR" "Daemon already running (PID: $existing_pid)"
            exit 1
        else
            log "WARN" "Removing stale lock file"
            rm -f "$LOCK_FILE"
        fi
    fi
    
    # Create lock file
    echo $$ > "$LOCK_FILE"
    
    log "INFO" "Starting $APP_NAME daemon (PID: $$)"
    
    # Rotate logs on startup
    rotate_logs
    
    # Change to app directory
    cd "$APP_DIR" || exit 1
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log "INFO" "Installing dependencies"
        npm install
    fi
    
    # Start initial server
    start_server
    
    # Start monitoring loop
    monitor_loop
}

# Stop daemon function
stop_daemon() {
    if [ -f "$LOCK_FILE" ]; then
        local daemon_pid=$(cat "$LOCK_FILE")
        if kill -0 "$daemon_pid" 2>/dev/null; then
            log "INFO" "Stopping daemon (PID: $daemon_pid)"
            kill "$daemon_pid"
            sleep 2
            
            if kill -0 "$daemon_pid" 2>/dev/null; then
                kill -9 "$daemon_pid"
            fi
        fi
        rm -f "$LOCK_FILE"
    fi
    
    stop_server
    log "INFO" "Daemon stopped"
}

# Status function
show_status() {
    if [ -f "$STATUS_FILE" ]; then
        cat "$STATUS_FILE"
    else
        echo '{"status": "not_running"}'
    fi
}

# Command handling
case "${1:-start}" in
    start)
        start_daemon
        ;;
    stop)
        stop_daemon
        ;;
    restart)
        stop_daemon
        sleep 2
        start_daemon
        ;;
    status)
        show_status
        ;;
    logs)
        tail -f "$LOG_DIR/daemon.log"
        ;;
    server-logs)
        tail -f "$LOG_DIR/server.log"
        ;;
    health)
        if [ -f "$PID_FILE" ]; then
            pid=$(cat "$PID_FILE")
            if health_check "$pid"; then
                echo "✅ Server is healthy"
                exit 0
            else
                echo "❌ Server is unhealthy"
                exit 1
            fi
        else
            echo "❌ Server is not running"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|server-logs|health}"
        exit 1
        ;;
esac