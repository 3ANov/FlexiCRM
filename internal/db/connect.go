package db

import (
	"fmt"
	"log"

	"FlexiCRM/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(dbPath string) error {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("ошибка подключения к базе: %w", err)
	}

	if err := DB.AutoMigrate(
		&models.Employee{},
		&models.Client{},
		&models.Task{},
		&models.Project{},
		&models.Note{},
		&models.Transaction{},
		&models.ClientDocument{},
		&models.EmployeeDocument{},
		&models.DocumentTemplate{},
	); err != nil {
		return fmt.Errorf("ошибка миграции моделей: %w", err)
	}

	log.Println("✅ Подключение к SQLite успешно установлено")
	return nil
}
