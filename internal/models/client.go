package models

import "time"

type Client struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"not null"`
	Phone       string `gorm:"index"`
	Email       string `gorm:"index"`
	Description string `gorm:"type:text"`
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Projects  []Project        `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE"`
	Notes     []Note           `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE"`
	Documents []ClientDocument `gorm:"foreignKey:ClientID;constraint:OnDelete:CASCADE"`
}
