// Файл: internal/database/connectPostgres.go
package database // <-- Имя пакета по названию папки

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// ConnectToDB с БОЛЬШОЙ буквы!
func ConnectToDB() *sql.DB {
	dsn := "host=db port=5432 user=webchat password=webchat dbname=webchat sslmode=disable"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Ошибка инициализации БД: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}
	db.SetMaxOpenConns(100)          // Максимальное кол-во активных соединений
	db.SetMaxIdleConns(50)           // Сколько держать "про запас"
	db.SetConnMaxLifetime(time.Hour) // Время жизни соединения
	return db
}
