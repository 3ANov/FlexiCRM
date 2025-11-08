package services

import "FlexiCRM/internal/repository"

type Services struct {
	Clients           *ClientService
	Projects          *ProjectService
	Employees         *EmployeeService
	Tasks             *TaskService
	Notes             *NoteService
	Transactions      *TransactionService
	ClientDocuments   *ClientDocumentService
	EmployeeDocuments *EmployeeDocumentService
}

func InitServices(repos *repository.Repositories) *Services {
	base := NewBaseService(repos.BaseRepo)

	return &Services{
		Clients:           NewClientService(repos.Clients, base),
		Projects:          NewProjectService(repos.Projects, base),
		Employees:         NewEmployeeService(repos.Employees, base),
		Tasks:             NewTaskService(repos.Tasks, base),
		Notes:             NewNoteService(repos.Notes, base),
		Transactions:      NewTransactionService(repos.Transactions, base),
		ClientDocuments:   NewClientDocumentService(repos.ClientDocuments, base),
		EmployeeDocuments: NewEmployeeDocumentService(repos.EmployeeDocuments, base),
	}
}
