package models

import "time"

type ClientDocument struct {
	ID         int
	ClientID   int
	TemplateID int
	CreatedAt  time.Time
	Data       map[string]string `gorm:"type:json"`
}
