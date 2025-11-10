package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type EmployeeService struct {
	*BaseService
	Repo *repository.EmployeeRepository
}

func NewEmployeeService(repo *repository.EmployeeRepository, base *BaseService) *EmployeeService {
	return &EmployeeService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *EmployeeService) GetByID(id uint) (*models.Employee, error) {
	return s.Repo.GetByID(id)
}

func (s *EmployeeService) GetAll() ([]models.Employee, error) {
	return s.Repo.GetAll()
}

func (s *EmployeeService) Delete(id uint) error {
	return s.Repo.Delete(&models.Employee{}, id)
}
