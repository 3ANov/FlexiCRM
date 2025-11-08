package models

import "time"

type Employee struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"size:100;not null"`
	Role      string `gorm:"size:50"`
	Email     string `gorm:"size:100"`
	Phone     string `gorm:"size:50"`
	Active    bool   `gorm:"default:true"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
