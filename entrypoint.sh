#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

wait_for_db() {
    log_info "Waiting for database to be ready..."
    local retries=30
    local count=0
    
    while ! nc -z $DB_HOST $DB_PORT; do
        if [ $count -ge $retries ]; then
            log_error "Database connection timeout after $retries attempts"
            exit 1
        fi
        log_warn "Database not ready, waiting 2 seconds... (attempt $((count + 1))/$retries)"
        sleep 2
        count=$((count + 1))
    done
    log_info "Database is ready!"
}

run_migrations() {
    log_info "Running database migrations..."
    
    if [ -f "./migrate" ]; then
        local db_url="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable"
        
        cd /app/backend
        
        log_info "Running down migrations first..."
        ./migrate -path ./migrations -database "$db_url" down -all || log_warn "Down migrations failed or no migrations to revert"
        
        log_info "Running up migrations..."
        ./migrate -path ./migrations -database "$db_url" up
        
        log_info "Migrations completed successfully"
        cd /app
    else
        log_error "Migration tool not found at ./migrate"
        # exit 1
    fi
}

start_backend() {
    log_info "Starting backend application..."
    
    export CONFIG_FILE="/app/backend/config/config.prod.yaml"
    
    if [ ! -f "$CONFIG_FILE" ]; then
        log_warn "Config file $CONFIG_FILE not found, falling back to default"
        export CONFIG_FILE="/app/backend/config/config.prod.yaml"
    fi
    
    log_info "Using config file: $CONFIG_FILE"

    if [ -f "/app/backend/bin/CarMaintenance" ]; then
        log_info "Starting CarMaintenance backend on port $BACKEND_PORT"
        /app/backend/bin/CarMaintenance
    else
        log_error "Backend binary not found at /app/backend/bin/CarMaintenance"
        exit 1
    fi
}

cleanup() {
    log_info "Shutting down gracefully..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    exit 0
}

main() {
    log_info "Starting application in $MODE mode..."
    log_info "Database: $DB_HOST:$DB_PORT/$DB_NAME"
    
    case "$1" in
        "migrate")
            wait_for_db
            run_migrations
            log_info "Migration completed, exiting"
            ;;
        "backend"|"")
            wait_for_db
            run_migrations
            start_backend
            ;;
        *)
            log_error "Usage: $0 {migrate|backend}"
            log_info "  migrate  - Run database migrations only"
            log_info "  backend  - Run migrations and start backend (default)"
            exit 1
            ;;
    esac
}

trap cleanup SIGINT SIGTERM

main migrate
main backend