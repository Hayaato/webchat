package service

import (
	"context"
	"errors"
	"fmt"
	"go-auth/internal/crypto"     // Твой путь
	"go-auth/internal/repository" // Твой путь
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// 1. ИСПРАВЛЕНИЕ: Возвращаем наши переменные с ошибками
var (
	ErrUserNotFound = errors.New("пользователь не найден")
	ErrInvalidPass  = errors.New("неверный пароль")
	ErrUserExists   = errors.New("пользователь уже существует")
)

// 2. ИСПРАВЛЕНИЕ: Возвращаем структуру для токенов
type TokenPair struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}

// Секрет для JWT (пока хардкод, потом вынесем в .env)
var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type AuthService struct {
	repo   *repository.UserRepository
	hasher *crypto.ArgonHasher
}

func NewAuthService(repo *repository.UserRepository, hasher *crypto.ArgonHasher) *AuthService {
	return &AuthService{
		repo:   repo,
		hasher: hasher,
	}
}

// В методе Register:
func (s *AuthService) Register(ctx context.Context, login, password string) error {
	// Вызываем хэшер с учетом лимита воркеров
	fmt.Println(jwtSecret)
	hashStr, err := s.hasher.HashPassword(ctx, password)
	if err != nil {
		return err
	}

	return s.repo.CreateUser(ctx, login, hashStr)
}

// В методе Login:
func (s *AuthService) Login(ctx context.Context, login, password string) (*TokenPair, error) {
	// 1. Ищем пользователя в базе данных
	user, err := s.repo.FindByLogin(ctx, login)
	if err != nil {
		// Если пользователь не найден (sql.ErrNoRows) или ошибка БД,
		// возвращаем ошибку сразу, чтобы не ловить панику ниже.
		return nil, err
	}

	// 2. Сверяем пришедший пароль с хэшем из базы.
	// Теперь это безопасно, так как мы точно знаем, что user != nil.
	err = s.hasher.ComparePassword(ctx, password, user.Password)
	if err != nil {
		// Если пароли не совпали, возвращаем кастомную ошибку
		return nil, ErrInvalidPass
	}

	// 3. Генерируем пару Access и Refresh токенов
	// (Этот метод должен быть описан в твоем AuthService)
	tokens, err := s.generateTokens(user.Login)
	if err != nil {
		return nil, err
	}

	return tokens, nil
}

// 3. ИСПРАВЛЕНИЕ: Возвращаем приватный метод генерации токенов
func (s *AuthService) generateTokens(login string) (*TokenPair, error) {
	// Создаем Access Token (15 минут)
	accessClaims := jwt.MapClaims{
		"login": login,
		"exp":   time.Now().Add(15 * time.Minute).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessString, err := accessToken.SignedString(jwtSecret)
	if err != nil {
		return nil, err
	}

	// Создаем Refresh Token (7 дней)
	refreshClaims := jwt.MapClaims{
		"refresh": login,
		"type":    "refresh",
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshString, err := refreshToken.SignedString(jwtSecret)
	if err != nil {
		return nil, err
	}

	return &TokenPair{
		Token:        accessString,
		RefreshToken: refreshString,
	}, nil
}
