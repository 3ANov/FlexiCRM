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

func (r *EmployeeDocumentRepository) Search(filter models.EmployeeDocumentSearch) ([]models.EmployeeDocument, error) {
	db := r.DB

	if filter.EmployeeID != nil {
		db = db.Where("employee_id = ?", *filter.EmployeeID)
	}

	if filter.TemplateID != nil {
		db = db.Where("template_id = ?", *filter.TemplateID)
	}

	var documents []models.EmployeeDocument
	err := db.Find(&documents).Error
	return documents, err
}

func (r *EmployeeDocumentRepository) GetByEmployeeID(empID uint) ([]models.EmployeeDocument, error) {
	var docs []models.EmployeeDocument

	err := r.DB.Preload("Template").
		Where("employee_id = ?", empID).
		Order("created_at DESC").
		Find(&docs).Error

	return docs, err
}
