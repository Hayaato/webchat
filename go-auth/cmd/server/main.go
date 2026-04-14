package main

import (
	"log"
	"net"
	"os"

	"go-auth/internal/crypto"
	"go-auth/internal/database"
	mygrpc "go-auth/internal/grpc" // Папка, где лежит наш написанный сервер (назвали mygrpc, чтобы не путать с пакетом grpc)
	pb "go-auth/internal/grpc/api" // Папка со сгенерированным кодом
	"go-auth/internal/repository"
	"go-auth/internal/service"

	"google.golang.org/grpc"
)

func main() {
	jwtKey := os.Getenv("JWT_SECRET")
	if jwtKey != "" {
		log.Println("✅ JWT_SECRET успешно получен из окружения!")
	} else {
		log.Println("❌ JWT_SECRET пуст!")
	}
	// 1. Инициализация базы и слоев (как было раньше)
	db := database.ConnectToDB()
	repo := repository.NewUserRepository(db)
	hasher := crypto.NewArgonHasher(12) // Твои 12 воркеров!
	authService := service.NewAuthService(repo, hasher)

	// 2. Создаем наш новый gRPC хендлер
	grpcHandler := mygrpc.NewAuthGrpcServer(authService)

	// 3. Открываем TCP-порт (50051 - это стандартный порт для gRPC)
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Ошибка открытия порта: %v", err)
	}

	// 4. Создаем "движок" gRPC сервера
	grpcServer := grpc.NewServer()

	// 5. Регистрируем наш хендлер в движке (эта функция сгенерирована протоком!)
	pb.RegisterAuthServiceServer(grpcServer, grpcHandler)

	// 6. Запускаем
	log.Println("⚡ gRPC сервер запущен на порту :50051")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Ошибка запуска gRPC сервера: %v", err)
	}
}
