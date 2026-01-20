package models

import "time"

type Task struct {
	ID          uint     `gorm:"primaryKey"`
	Title       string   `gorm:"size:150;not null"`
	Description string   `gorm:"type:text"`
	AssignedTo  uint     `gorm:"index"`
	Employee    Employee `gorm:"foreignKey:AssignedTo"`
	ProjectID   uint     `gorm:"index"`
	Project     Project  `gorm:"foreignKey:ProjectID"`
	Status      string   `gorm:"size:20;default:'New'"`
	Deadline    time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
