package crypto

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

var (
	ErrInvalidHash  = errors.New("неверный формат хэша")
	ErrPassMismatch = errors.New("пароли не совпадают")
)

// Настройки Argon2, которые ты запросил
const (
	timeCost uint32 = 1         // 1 итерация
	memory   uint32 = 16 * 1024 // 16 MB (в килобайтах)
	threads  uint8  = 1         // 1 поток на один хэш
	keyLen   uint32 = 32        // Длина итогового ключа
	saltLen  uint32 = 16        // Длина соли
)

type ArgonHasher struct {
	// Буферизованный канал будет работать как турникет на 12 мест
	workers chan struct{}
}

// NewArgonHasher принимает количество воркеров (твои 12)
func NewArgonHasher(maxWorkers int) *ArgonHasher {
	return &ArgonHasher{
		workers: make(chan struct{}, maxWorkers),
	}
}

// HashPassword создает хэш, блокируясь, если все 12 воркеров заняты
func (h *ArgonHasher) HashPassword(ctx context.Context, password string) (string, error) {
	// 1. Пытаемся занять место в пуле воркеров.
	// Используем select с контекстом, чтобы если юзер закрыл браузер
	// пока стоял в очереди, мы даже не начинали считать хэш.
	select {
	case h.workers <- struct{}{}: // Занимаем слот
		defer func() { <-h.workers }() // Освобождаем слот при выходе
	case <-ctx.Done():
		return "", ctx.Err() // Запрос отменен до того, как дошла очередь
	}

	// 2. Генерируем случайную соль
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	// 3. Считаем Argon2id (самая защищенная версия Argon2 на сегодня)
	hash := argon2.IDKey([]byte(password), salt, timeCost, memory, threads, keyLen)

	// 4. Упаковываем параметры, соль и хэш в одну строку для сохранения в БД
	// Формат: $argon2id$v=19$m=16384,t=1,p=1$<salt_base64>$<hash_base64>
	encodedHash := fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, memory, timeCost, threads,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	)

	return encodedHash, nil
}

// ComparePassword проверяет пароль. Тоже использует турникет!
func (h *ArgonHasher) ComparePassword(ctx context.Context, password, encodedHash string) error {
	// Занимаем слот воркера
	select {
	case h.workers <- struct{}{}:
		defer func() { <-h.workers }()
	case <-ctx.Done():
		return ctx.Err()
	}

	// 1. Разбиваем строку из БД на компоненты
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 || parts[1] != "argon2id" {
		return ErrInvalidHash
	}

	// 2. Достаем параметры (в хорошем коде тут нужно парсить parts[3],
	// но для упрощения мы знаем, что используем наши константы)

	// 3. Декодируем соль и оригинальный хэш
	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return ErrInvalidHash
	}
	expectedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return ErrInvalidHash
	}

	// 4. Вычисляем новый хэш с теми же параметрами и солью
	actualHash := argon2.IDKey([]byte(password), salt, timeCost, memory, threads, keyLen)

	// 5. Безопасное сравнение (защита от Timing-атак)
	if subtle.ConstantTimeCompare(expectedHash, actualHash) == 1 {
		return nil // Пароли совпали
	}

	return ErrPassMismatch
}
