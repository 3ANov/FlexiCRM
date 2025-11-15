package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type ClientDocumentService struct {
	*BaseService
	Repo *repository.ClientDocumentRepository
}

func NewClientDocumentService(repo *repository.ClientDocumentRepository, base *BaseService) *ClientDocumentService {
	return &ClientDocumentService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *ClientDocumentService) GetByID(id uint) (*models.ClientDocument, error) {
	return s.Repo.GetByID(id)
}

func (s *ClientDocumentService) GetAll() ([]models.ClientDocument, error) {
	return s.Repo.GetAll()
}

func (s *ClientDocumentService) Delete(id uint) error {
	return s.Repo.Delete(&models.ClientDocument{}, id)
}

func (s *ClientDocumentService) Search(filters models.ClientDocumentSearch) ([]models.ClientDocument, error) {
	return s.Repo.Search(filters)
}
