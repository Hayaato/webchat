# Этап 1: Сборка
FROM golang:1.26-alpine AS builder
WORKDIR /app

# Копируем go.mod и go.sum из папки go-auth
COPY go-auth/go.mod go-auth/go.sum ./
RUN go mod download

# Копируем весь исходный код из go-auth
COPY go-auth/ ./

# Собираем бинарник
RUN go build -o main ./cmd/server/main.go

# Этап 2: Запуск
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 50051
CMD ["./main"]