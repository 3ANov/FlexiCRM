package db

import (
	"fmt"
	"log"

	"FlexiCRM/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() error {
	var err error
	DB, err = gorm.Open(sqlite.Open("flexicrm.db"), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("ошибка подключения к базе: %w", err)
	}

	if err := DB.AutoMigrate(&models.User{}); err != nil {
		return fmt.Errorf("ошибка миграции моделей: %w", err)
	}

	log.Println("✅ Подключение к SQLite успешно установлено")
	return nil
}
