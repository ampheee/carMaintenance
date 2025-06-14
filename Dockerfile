FROM node:18-alpine AS frontend_builder

WORKDIR     /app/frontend
COPY        frontend/package*.json ./
RUN         npm ci --only=production
COPY        frontend/ ./
RUN         npm run build

FROM        golang:1.24-alpine AS backend_builder

RUN         apk add --no-cache git ca-certificates
WORKDIR     /app/backend
COPY        backend/go.mod backend/go.sum ./
RUN         go mod download
COPY        backend/ ./
COPY        config/  /app/config
RUN         CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o bin/CarMaintenance cmd/app/main.go

FROM        alpine:latest

RUN         apk add --no-cache \
                ca-certificates \
                bash \
                netcat-openbsd \
                curl \
                && rm -rf /var/cache/apk/*

RUN         addgroup -g 1001 -S appgroup && \
                adduser -S appuser -u 1001 -G appgroup

WORKDIR     /app

COPY        --from=backend_builder /app/config ./config
COPY        --from=backend_builder /app/backend/bin/CarMaintenance ./backend/bin/CarMaintenance
COPY        --from=backend_builder /app/backend/migrations ./backend/migrations
COPY        --from=frontend_builder /app/frontend/build ./frontend/build

COPY        entrypoint.sh ./
RUN         chmod +x ./entrypoint.sh

RUN         chown -R appuser:appgroup /app

USER        appuser

EXPOSE      8080

ENTRYPOINT ["./entrypoint.sh"]