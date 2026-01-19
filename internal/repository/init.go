package repository

import "gorm.io/gorm"

type Repositories struct {
	BaseRepo          *Repository
	Clients           *ClientRepository
	Projects          *ProjectRepository
	Employees         *EmployeeRepository
	Tasks             *TaskRepository
	Notes             *NoteRepository
	Transactions      *TransactionRepository
	ClientDocuments   *ClientDocumentRepository
	EmployeeDocuments *EmployeeDocumentRepository
	DocumentTemplates *DocumentTemplateRepository
}

func InitRepositories(db *gorm.DB) *Repositories {
	base := NewRepository(db)

	return &Repositories{
		BaseRepo:          base,
		Clients:           NewClientRepository(base),
		Projects:          NewProjectRepository(base),
		Employees:         NewEmployeeRepository(base),
		Tasks:             NewTaskRepository(base),
		Notes:             NewNoteRepository(base),
		Transactions:      NewTransactionRepository(base),
		ClientDocuments:   NewClientDocumentRepository(base),
		EmployeeDocuments: NewEmployeeDocumentRepository(base),
		DocumentTemplates: NewDocumentTemplateRepository(base),
	}
}
