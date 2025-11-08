package models

import "time"

type Note struct {
	ID        uint   `gorm:"primaryKey"`
	Content   string `gorm:"not null"`
	ClientID  *uint  `gorm:"index"`
	DealID    *uint  `gorm:"index"`
	CreatedAt time.Time
}
