package bindings

import "FlexiCRM/internal/services"

type Bindings struct {
	Clients           *ClientBindings
	Tasks             *TaskBindings
	Projects          *ProjectBindings
	Employees         *EmployeeBindings
	Notes             *NoteBindings
	Transactions      *TransactionBindings
	ClientDocuments   *ClientDocumentBindings
	EmployeeDocuments *EmployeeDocumentBindings
}

// InitBindings создаёт все биндинги для Wails
func InitBindings(s *services.Services) *Bindings {
	return &Bindings{
		Clients:           NewClientBindings(s.Clients),
		Tasks:             NewTaskBindings(s.Tasks),
		Projects:          NewProjectBindings(s.Projects),
		Employees:         NewEmployeeBindings(s.Employees),
		Notes:             NewNoteBindings(s.Notes),
		Transactions:      NewTransactionBindings(s.Transactions),
		ClientDocuments:   NewClientDocumentBindings(s.ClientDocuments),
		EmployeeDocuments: NewEmployeeDocumentBindings(s.EmployeeDocuments),
	}
}
