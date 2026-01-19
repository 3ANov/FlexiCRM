package models

import "time"

type ClientSearch struct {
	Query string `json:"query,omitempty"`
}

type EmployeeSearch struct {
	Query  string `json:"query,omitempty"`
	Active *bool  `json:"active,omitempty"`
}

type ProjectSearch struct {
	Query    string `json:"query,omitempty"`
	ClientID *uint  `json:"client_id,omitempty"`
	Status   string `json:"status,omitempty"`
}

type TaskSearch struct {
	Query      string     `json:"query,omitempty"`
	Status     string     `json:"status,omitempty"`
	AssignedTo *uint      `json:"assigned_to,omitempty"`
	ProjectID  *uint      `json:"project_id,omitempty"`
	Deadline   *time.Time `json:"deadline,omitempty"`
}

type TransactionSearch struct {
	Query     string     `json:"query,omitempty"`
	Type      string     `json:"type,omitempty"` // Income / Expense
	Category  string     `json:"category,omitempty"`
	DateFrom  *time.Time `json:"date_from,omitempty"`
	DateTo    *time.Time `json:"date_to,omitempty"`
	MinAmount *float64   `json:"min_amount,omitempty"`
	MaxAmount *float64   `json:"max_amount,omitempty"`
}

type NoteSearch struct {
	Query     string `json:"query,omitempty"`
	ClientID  *uint  `json:"client_id,omitempty"`
	ProjectID *uint  `json:"project_id,omitempty"`
}

type ClientDocumentSearch struct {
	ClientID   *int `json:"client_id,omitempty"`
	TemplateID *int `json:"template_id,omitempty"`
}

type EmployeeDocumentSearch struct {
	EmployeeID *int `json:"employee_id,omitempty"`
	TemplateID *int `json:"template_id,omitempty"`
}

type DocumentTemplateSearch struct {
	Query string `json:"query,omitempty"`
}
