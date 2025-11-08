package models

import "time"

type Project struct {
	ID          uint   `gorm:"primaryKey"`
	ClientID    uint   `gorm:"not null;index"`
	Name        string `gorm:"not null"`
	Description string `gorm:"type:text"`
	Status      string `gorm:"size:50"` // "New", "InProgress", "Completed"
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Tasks []Task `gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE"`
}
