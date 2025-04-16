FROM node:alpine AS frontend_builder

WORKDIR /app

COPY    frontend/package*.json ./
RUN     npm install

COPY    frontend/ ./

RUN     npm cache clean --force
RUN     npm run build

FROM golang:alpine AS backend_builder

WORKDIR /app

COPY    backend/ .

RUN     go mod download && go mod tidy
RUN     CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build  -o CarMaintenance cmd/app/main.go

FROM alpine:latest

WORKDIR /app

COPY . .

COPY --from=frontend_builder  /app/build                                ./frontend/build
COPY --from=backend_builder   /app/CarMaintenance                       ./backend/CarMaintenance

EXPOSE 8080

WORKDIR /app/backend

ENTRYPOINT ["./CarMaintenance"]