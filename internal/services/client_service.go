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

func (s *ClientService) Search(filters models.ClientSearch) ([]models.Client, error) {
	return s.Repo.Search(filters)
}

func (s *ClientService) GetAll() ([]models.Client, error) {
	return s.Repo.GetAll()
}

func (s *ClientService) Delete(id uint) error {
	return s.Repo.Delete(&models.Client{}, id)
}
