package repository

import "gorm.io/gorm"

type Repositories struct {
	Users             *UserRepository
	Clients           *ClientRepository
	Projects          *ProjectRepository
	Tasks             *TaskRepository
	Notes             *NoteRepository
	Transactions      *TransactionRepository
	ClientDocuments   *ClientDocumentRepository
	EmployeeDocuments *EmployeeDocumentRepository
}

func InitRepositories(db *gorm.DB) *Repositories {
	base := NewRepository(db)

	return &Repositories{
		Users:             NewUserRepository(base),
		Clients:           NewClientRepository(base),
		Projects:          NewProjectRepository(base),
		Tasks:             NewTaskRepository(base),
		Notes:             NewNoteRepository(base),
		Transactions:      NewTransactionRepository(base),
		ClientDocuments:   NewClientDocumentRepository(base),
		EmployeeDocuments: NewEmployeeDocumentRepository(base),
	}
}
