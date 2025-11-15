package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type ProjectService struct {
	*BaseService
	Repo *repository.ProjectRepository
}

func NewProjectService(repo *repository.ProjectRepository, base *BaseService) *ProjectService {
	return &ProjectService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *ProjectService) GetByID(id uint) (*models.Project, error) {
	return s.Repo.GetByID(id)
}

func (s *ProjectService) GetAll() ([]models.Project, error) {
	return s.Repo.GetAll()
}

func (s *ProjectService) Search(filters models.ProjectSearch) ([]models.Project, error) {
	return s.Repo.Search(filters)
}

func (s *ProjectService) Delete(id uint) error {
	return s.Repo.Delete(&models.Project{}, id)
}
