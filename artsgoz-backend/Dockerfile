FROM golang:1.26-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/api ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/migrate ./cmd/migrate

FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata netcat-openbsd postgresql-client

COPY --from=builder /app/api /app/api
COPY --from=builder /app/migrate /app/migrate
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/seeds /app/seeds
COPY entrypoint.sh /app/entrypoint.sh

RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]

