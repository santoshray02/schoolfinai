#!/bin/bash

# SchoolFinAI Management Script
# This script provides commands to start, stop, and set up the SchoolFinAI application

# Configuration
APP_NAME="SchoolFinAI"
APP_PORT=21600
APP_HOST="0.0.0.0"
APP_URL="http://dbws107.paperentry.ai:21600"
LOG_DIR="./logs"
PID_FILE="./schoolfinai.pid"
ENV_FILE=".env.local"
ENV_EXAMPLE="env.example"

# Create logs directory if it doesn't exist
mkdir -p $LOG_DIR

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
  local level=$1
  local message=$2
  local color=$NC
  
  case $level in
    "INFO") color=$BLUE ;;
    "SUCCESS") color=$GREEN ;;
    "WARNING") color=$YELLOW ;;
    "ERROR") color=$RED ;;
  esac
  
  echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $message${NC}"
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$LOG_DIR/schoolfinai.log"
}

# Check if Node.js is installed
check_node() {
  if ! command -v node &> /dev/null; then
    log "ERROR" "Node.js is not installed. Please install Node.js before continuing."
    exit 1
  fi
  
  local node_version=$(node -v | cut -d 'v' -f 2)
  log "INFO" "Node.js version: $node_version"
  
  # Check if Node.js version is at least 18
  if [[ $(echo "$node_version" | cut -d '.' -f 1) -lt 18 ]]; then
    log "WARNING" "Node.js version should be at least 18.x. Current version: $node_version"
  fi
}

# Check if npm is installed
check_npm() {
  if ! command -v npm &> /dev/null; then
    log "ERROR" "npm is not installed. Please install npm before continuing."
    exit 1
  fi
  
  local npm_version=$(npm -v)
  log "INFO" "npm version: $npm_version"
}

# Check if the application is running
is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid=$(cat "$PID_FILE")
    if ps -p "$pid" > /dev/null; then
      return 0 # Running
    else
      # PID file exists but process is not running
      rm "$PID_FILE"
    fi
  fi
  return 1 # Not running
}

# Start the application
start() {
  log "INFO" "Starting $APP_NAME..."
  
  if is_running; then
    log "WARNING" "$APP_NAME is already running with PID $(cat "$PID_FILE")"
    return
  fi
  
  # Check if .env.local exists
  if [ ! -f "$ENV_FILE" ]; then
    log "ERROR" "Environment file $ENV_FILE not found. Run 'setup' command first."
    exit 1
  fi
  
  # Start the application in development mode
  if [ "$1" == "dev" ]; then
    log "INFO" "Starting in development mode..."
    npm run dev:custom > "$LOG_DIR/app.log" 2>&1 &
  else
    # Start the application in production mode
    log "INFO" "Starting in production mode..."
    npm run build
    npm run start:custom > "$LOG_DIR/app.log" 2>&1 &
  fi
  
  # Save the PID
  echo $! > "$PID_FILE"
  
  # Check if the application started successfully
  sleep 5
  if is_running; then
    log "SUCCESS" "$APP_NAME started successfully with PID $(cat "$PID_FILE")"
    log "INFO" "Application is running at $APP_URL"
  else
    log "ERROR" "Failed to start $APP_NAME. Check logs for details."
    cat "$LOG_DIR/app.log"
  fi
}

# Stop the application
stop() {
  log "INFO" "Stopping $APP_NAME..."
  
  if is_running; then
    local pid=$(cat "$PID_FILE")
    
    # Try graceful shutdown first
    kill -15 "$pid"
    log "INFO" "Sent SIGTERM to process $pid"
    
    # Wait for up to 10 seconds for graceful shutdown
    local count=0
    while [ $count -lt 10 ] && is_running; do
      sleep 1
      ((count++))
    done
    
    # If still running, force kill
    if is_running; then
      log "WARNING" "Process did not terminate gracefully, forcing shutdown..."
      kill -9 "$pid"
    fi
    
    # Clean up PID file
    rm -f "$PID_FILE"
    log "SUCCESS" "$APP_NAME stopped successfully"
  else
    log "WARNING" "$APP_NAME is not running"
  fi
  
  # Kill any processes using the port
  local port_pid=$(lsof -ti:$APP_PORT)
  if [ ! -z "$port_pid" ]; then
    log "WARNING" "Found process $port_pid still using port $APP_PORT, killing it..."
    kill -9 $port_pid
  fi
}

# Restart the application
restart() {
  log "INFO" "Restarting $APP_NAME..."
  stop
  sleep 2
  start "$1"
}

# Set up the application
setup() {
  log "INFO" "Setting up $APP_NAME..."
  
  # Check Node.js and npm
  check_node
  check_npm
  
  # Install dependencies
  log "INFO" "Installing dependencies..."
  npm install
  
  # Set up environment file if it doesn't exist
  if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$ENV_EXAMPLE" ]; then
      cp "$ENV_EXAMPLE" "$ENV_FILE"
      log "SUCCESS" "Created $ENV_FILE from example file"
      log "INFO" "Please edit $ENV_FILE to configure your application"
    else
      log "ERROR" "Environment example file $ENV_EXAMPLE not found"
      exit 1
    fi
  else
    log "INFO" "Environment file $ENV_FILE already exists"
  fi
  
  # Set up the database
  log "INFO" "Setting up database..."
  npx prisma generate
  
  # Ask if user wants to run migrations
  read -p "Do you want to run database migrations? (y/n): " run_migrations
  if [[ $run_migrations == "y" || $run_migrations == "Y" ]]; then
    npx prisma migrate dev
    log "SUCCESS" "Database migrations completed"
  else
    log "INFO" "Skipping database migrations"
  fi
  
  log "SUCCESS" "Setup completed successfully"
  log "INFO" "You can now start the application with './manage.sh start'"
}

# Show application status
status() {
  if is_running; then
    log "INFO" "$APP_NAME is running with PID $(cat "$PID_FILE")"
    log "INFO" "Application URL: $APP_URL"
    
    # Show resource usage
    local pid=$(cat "$PID_FILE")
    echo "Process details:"
    ps -p "$pid" -o pid,ppid,user,%cpu,%mem,vsz,rss,stat,start,time,command
    
    # Check if the application is responding
    if command -v curl &> /dev/null; then
      log "INFO" "Checking application health..."
      if curl -s --head "$APP_URL" | grep "200 OK" > /dev/null; then
        log "SUCCESS" "Application is responding normally"
      else
        log "WARNING" "Application may not be responding correctly"
      fi
    fi
  else
    log "INFO" "$APP_NAME is not running"
  fi
}

# Show logs
logs() {
  if [ -f "$LOG_DIR/app.log" ]; then
    if [ "$1" == "follow" ]; then
      tail -f "$LOG_DIR/app.log"
    else
      # Show last 50 lines by default
      local lines=${1:-50}
      tail -n "$lines" "$LOG_DIR/app.log"
    fi
  else
    log "ERROR" "Log file not found"
  fi
}

# Show help
show_help() {
  echo -e "${BLUE}$APP_NAME Management Script${NC}"
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  setup              Set up the application (install dependencies, create env file, etc.)"
  echo "  start [dev]        Start the application (use 'dev' for development mode)"
  echo "  stop               Stop the application"
  echo "  restart [dev]      Restart the application"
  echo "  status             Show application status"
  echo "  logs [lines|follow] Show application logs (last N lines or follow)"
  echo "  help               Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 setup           # Set up the application"
  echo "  $0 start           # Start in production mode"
  echo "  $0 start dev       # Start in development mode"
  echo "  $0 logs 100        # Show last 100 lines of logs"
  echo "  $0 logs follow     # Follow logs in real-time"
}

# Main script execution
case "$1" in
  "setup")
    setup
    ;;
  "start")
    start "$2"
    ;;
  "stop")
    stop
    ;;
  "restart")
    restart "$2"
    ;;
  "status")
    status
    ;;
  "logs")
    logs "$2"
    ;;
  "help"|"")
    show_help
    ;;
  *)
    log "ERROR" "Unknown command: $1"
    show_help
    exit 1
    ;;
esac

exit 0
