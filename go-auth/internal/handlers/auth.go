package handlers

import (
	"encoding/json"
	"errors"
	"go-auth/internal/service"
	"net/http"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

// Структура для приема JSON {"login": "...", "password": "..."}
type AuthRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

// HandleRegister обрабатывает регистрацию
func (h *AuthHandler) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат JSON", http.StatusBadRequest)
		return
	}

	err := h.service.Register(r.Context(), req.Login, req.Password)
	if err != nil {
		http.Error(w, "Ошибка при регистрации", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated) // Возвращаем 201 Created
}

// HandleLogin обрабатывает логин
func (h *AuthHandler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Неверный формат JSON", http.StatusBadRequest)
		return
	}

	tokens, err := h.service.Login(r.Context(), req.Login, req.Password)
	if err != nil {
		// Распределяем HTTP-статусы в зависимости от типа ошибки
		switch {
		case errors.Is(err, service.ErrUserNotFound):
			http.Error(w, "Не найдено", http.StatusNotFound) // 404
		case errors.Is(err, service.ErrInvalidPass):
			http.Error(w, "Неверный пароль", http.StatusUnauthorized) // 401
		default:
			http.Error(w, "Внутренняя ошибка", http.StatusInternalServerError) // 500
		}
		return
	}

	// Отправляем JSON с токенами
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tokens)
}
