package models

import "time"

type Transaction struct {
	ID        uint      `gorm:"primaryKey"`
	Type      string    `gorm:"size:10;not null"` // "Income" / "Expense"
	Amount    float64   `gorm:"not null"`
	Date      time.Time `gorm:"not null"`
	Category  string    `gorm:"size:50"`
	Notes     string    `gorm:"type:text"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
