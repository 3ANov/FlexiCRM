package bindings

import (
	"FlexiCRM/internal/services"
	"context"
)

type Bindings struct {
	Clients           *ClientBindings
	Tasks             *TaskBindings
	Projects          *ProjectBindings
	Employees         *EmployeeBindings
	Notes             *NoteBindings
	Transactions      *TransactionBindings
	ClientDocuments   *ClientDocumentBindings
	EmployeeDocuments *EmployeeDocumentBindings
	DocumentTemplates *DocumentTemplateBindings
}

func InitBindings(s *services.Services) *Bindings {
	return &Bindings{
		Clients:           NewClientBindings(s.Clients),
		Tasks:             NewTaskBindings(s.Tasks),
		Projects:          NewProjectBindings(s.Projects),
		Employees:         NewEmployeeBindings(s.Employees),
		Notes:             NewNoteBindings(s.Notes),
		Transactions:      NewTransactionBindings(s.Transactions),
		DocumentTemplates: NewDocumentTemplateBindings(s.DocumentTemplates),
		ClientDocuments:   NewClientDocumentBindings(s.ClientDocuments),
		EmployeeDocuments: NewEmployeeDocumentBindings(s.EmployeeDocuments),
	}
}

func (b *Bindings) SetContext(ctx context.Context) {
	b.EmployeeDocuments.SetContext(ctx)
	b.ClientDocuments.SetContext(ctx)
	b.DocumentTemplates.SetContext(ctx)
}
