package db

import "fmt"

type DummyDB struct{}

func (d *DummyDB) Ping() error {
	fmt.Println("Псевдо-подключение к базе данных установлено")
	return nil
}

func Connect() (*DummyDB, error) {
	fmt.Println("Инициализация заглушки вместо реальной БД")
	db := &DummyDB{}
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ошибка инициализации заглушки: %w", err)
	}
	return db, nil
}
