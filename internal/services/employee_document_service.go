package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type EmployeeDocumentService struct {
	*BaseService
	Repo *repository.EmployeeDocumentRepository
}

func NewEmployeeDocumentService(repo *repository.EmployeeDocumentRepository, base *BaseService) *EmployeeDocumentService {
	return &EmployeeDocumentService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *EmployeeDocumentService) GetByID(id uint) (*models.EmployeeDocument, error) {
	return s.Repo.GetByID(id)
}

func (s *EmployeeDocumentService) GetAll() ([]models.EmployeeDocument, error) {
	return s.Repo.GetAll()
}
