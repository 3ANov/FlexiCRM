package repository

import (
	"FlexiCRM/internal/models"
)

type EmployeeRepository struct {
	*Repository
}

func NewEmployeeRepository(r *Repository) *EmployeeRepository {
	return &EmployeeRepository{r}
}

func (r *EmployeeRepository) GetByID(id uint) (*models.Employee, error) {
	var employee models.Employee
	err := r.DB.First(&employee, id).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}

func (r *EmployeeRepository) GetAll() ([]models.Employee, error) {
	var employees []models.Employee
	err := r.DB.Find(&employees).Error
	return employees, err
}

func (r *EmployeeRepository) FindByEmail(email string) (*models.Employee, error) {
	var employee models.Employee
	err := r.DB.Where("email = ?", email).First(&employee).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}
