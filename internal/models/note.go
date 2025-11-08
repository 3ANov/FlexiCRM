package models

import "time"

type Note struct {
	ID        uint   `gorm:"primaryKey"`
	Content   string `gorm:"not null"`
	ClientID  *uint  `gorm:"index"`
	ProjectID *uint  `gorm:"index"`
	CreatedAt time.Time
}
