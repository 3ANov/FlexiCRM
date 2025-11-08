package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type ClientService struct {
	*BaseService
	Repo *repository.ClientRepository
}

func NewClientService(repo *repository.ClientRepository, base *BaseService) *ClientService {
	return &ClientService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *ClientService) GetByID(id uint) (*models.Client, error) {
	return s.Repo.GetByID(id)
}

func (s *ClientService) Search(query string) ([]models.Client, error) {
	return s.Repo.Search(query)
}

func (s *ClientService) GetAll() ([]models.Client, error) {
	return s.Repo.GetAll()
}
