package repository

import (
	"FlexiCRM/internal/models"
)

type EmployeeDocumentRepository struct {
	*Repository
}

func NewEmployeeDocumentRepository(r *Repository) *EmployeeDocumentRepository {
	return &EmployeeDocumentRepository{r}
}

func (r *EmployeeDocumentRepository) GetByID(id uint) (*models.EmployeeDocument, error) {
	var doc models.EmployeeDocument
	if err := r.DB.First(&doc, id).Error; err != nil {
		return nil, err
	}
	return &doc, nil
}

func (r *EmployeeDocumentRepository) GetAll() ([]models.EmployeeDocument, error) {
	var docs []models.EmployeeDocument
	err := r.DB.Find(&docs).Error
	return docs, err
}

func (r *EmployeeDocumentRepository) GetByEmployee(employeeID uint) ([]models.EmployeeDocument, error) {
	var docs []models.EmployeeDocument
	if err := r.DB.
		Where("employee_id = ?", employeeID).
		Order("created_at DESC").
		Find(&docs).Error; err != nil {
		return nil, err
	}
	return docs, nil
}
