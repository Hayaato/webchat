package grpc

import (
	"context"
	"errors"

	pb "go-auth/internal/grpc/api" // Твой сгенерированный код
	"go-auth/internal/service"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// AuthGrpcServer связывает сгенерированный код gRPC с твоей бизнес-логикой
type AuthGrpcServer struct {
	pb.UnimplementedAuthServiceServer
	authService *service.AuthService
}

func NewAuthGrpcServer(authService *service.AuthService) *AuthGrpcServer {
	return &AuthGrpcServer{authService: authService}
}

// --- ЛОГИН ---
func (s *AuthGrpcServer) Login(ctx context.Context, req *pb.AuthRequest) (*pb.LoginResponse, error) {
	// Вызываем твой сервис. req.GetLogin() - безопасный метод из сгенерированного кода
	tokens, err := s.authService.Login(ctx, req.GetLogin(), req.GetPassword())

	if err != nil {
		if errors.Is(err, service.ErrInvalidPass) || errors.Is(err, service.ErrUserNotFound) {
			// Возвращаем стандартную gRPC ошибку "Не авторизован" (код 16)
			return nil, status.Error(codes.Unauthenticated, "Неверный логин или пароль")
		}
		return nil, status.Error(codes.Internal, "Внутренняя ошибка сервера")
	}

	// Возвращаем структуру, которую ожидает Node.js
	return &pb.LoginResponse{
		Token:        tokens.Token,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

// --- РЕГИСТРАЦИЯ ---
func (s *AuthGrpcServer) Register(ctx context.Context, req *pb.AuthRequest) (*pb.RegisterResponse, error) {
	err := s.authService.Register(ctx, req.GetLogin(), req.GetPassword())

	if err != nil {
		// Сам Go решает, какой HTTP-статус отдать Ноде
		if errors.Is(err, service.ErrUserExists) {
			return &pb.RegisterResponse{Status: 400, Message: "Пользователь уже существует"}, nil
		}
		return &pb.RegisterResponse{Status: 500, Message: "Внутренняя ошибка сервера"}, nil
	}

	return &pb.RegisterResponse{Status: 200, Message: "Успешная регистрация"}, nil
}
