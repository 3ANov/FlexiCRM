package models

import "time"

type EmployeeDocument struct {
	ID         int
	EmployeeID int
	TemplateID int
	CreatedAt  time.Time
	Data       map[string]string
}
