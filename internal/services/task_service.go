package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type TaskService struct {
	*BaseService
	Repo *repository.TaskRepository
}

func NewTaskService(repo *repository.TaskRepository, base *BaseService) *TaskService {
	return &TaskService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *TaskService) GetByID(id uint) (*models.Task, error) {
	return s.Repo.GetByID(id)
}

func (s *TaskService) GetAll() ([]models.Task, error) {
	return s.Repo.GetAll()
}

func (s *TaskService) Delete(id uint) error {
	return s.Repo.Delete(&models.Task{}, id)
}

func (s *TaskService) Search(filters models.TaskSearch) ([]models.Task, error) {
	return s.Repo.Search(filters)
}
