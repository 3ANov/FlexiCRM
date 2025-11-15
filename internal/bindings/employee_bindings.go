package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type EmployeeBindings struct {
	service *services.EmployeeService
}

func NewEmployeeBindings(s *services.EmployeeService) *EmployeeBindings {
	return &EmployeeBindings{service: s}
}

func (b *EmployeeBindings) GetAll() ([]models.Employee, error) {
	return b.service.GetAll()
}

func (b *EmployeeBindings) GetByID(id uint) (*models.Employee, error) {
	return b.service.GetByID(id)
}

func (b *EmployeeBindings) Create(emp *models.Employee) error {
	return b.service.Create(emp)
}

func (b *EmployeeBindings) Update(emp *models.Employee) error {
	return b.service.Update(emp)
}

func (b *EmployeeBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (b *EmployeeBindings) Search(filters models.EmployeeSearch) ([]models.Employee, error) {
	return b.service.Search(filters)
}
