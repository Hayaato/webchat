package repository

import (
	"context"
	"database/sql"
)

// User - структура, отражающая строку в таблице users
type User struct {
	ID       int
	Login    string
	Password string // Тут лежит хэш
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// FindByLogin - эквивалент твоего первого запроса
func (r *UserRepository) FindByLogin(ctx context.Context, login string) (*User, error) {
	var user User

	// QueryRowContext сразу берет одну строку. $1 подставляется безопасно (защита от SQL-инъекций)
	err := r.db.QueryRowContext(ctx,
		"SELECT id, login, password FROM users WHERE login = $1",
		login,
	).Scan(&user.ID, &user.Login, &user.Password) // Записываем результат в структуру

	if err != nil {
		return nil, err // Если юзера нет, вернет sql.ErrNoRows
	}

	return &user, nil
}

// CreateUser - эквивалент твоего второго запроса
func (r *UserRepository) CreateUser(ctx context.Context, login, hash string) error {
	// ExecContext используется, когда нам не нужно читать ответ, а просто выполнить INSERT/UPDATE
	_, err := r.db.ExecContext(ctx,
		"INSERT INTO users (login, password) VALUES ($1, $2)",
		login, hash,
	)
	return err
}
