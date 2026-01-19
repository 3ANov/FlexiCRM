package models

type EmployeeDocument struct {
	BaseDocument
	EmployeeID uint `json:"EmployeeID"`
}
