package services

import (
	"FlexiCRM/internal/config"
	"FlexiCRM/internal/repository"
)

type Services struct {
	Clients           *ClientService
	Projects          *ProjectService
	Employees         *EmployeeService
	Tasks             *TaskService
	Notes             *NoteService
	Transactions      *TransactionService
	DocumentTemplates *DocumentTemplateService
	ClientDocuments   *ClientDocumentService
	EmployeeDocuments *EmployeeDocumentService
}

func InitServices(repos *repository.Repositories, cfg *config.Config) *Services {
	base := NewBaseService(repos.BaseRepo)
	tmplService := NewDocumentTemplateService(repos.DocumentTemplates, cfg.TemplatesPath, base)

	return &Services{
		Clients:           NewClientService(repos.Clients, base),
		Projects:          NewProjectService(repos.Projects, base),
		Employees:         NewEmployeeService(repos.Employees, base),
		Tasks:             NewTaskService(repos.Tasks, base),
		Notes:             NewNoteService(repos.Notes, base),
		Transactions:      NewTransactionService(repos.Transactions, base),
		DocumentTemplates: tmplService,
		EmployeeDocuments: NewEmployeeDocumentService(repos.EmployeeDocuments, tmplService, base),
		ClientDocuments:   NewClientDocumentService(repos.ClientDocuments, tmplService, base),
	}
}
