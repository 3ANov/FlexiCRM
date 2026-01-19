package repository

import (
	"FlexiCRM/internal/models"
)

type DocumentTemplateRepository struct {
	*Repository
}

func NewDocumentTemplateRepository(r *Repository) *DocumentTemplateRepository {
	return &DocumentTemplateRepository{r}
}

func (r *DocumentTemplateRepository) GetByID(id uint) (*models.DocumentTemplate, error) {
	var template models.DocumentTemplate
	err := r.DB.First(&template, id).Error
	if err != nil {
		return nil, err
	}
	return &template, nil
}

func (r *DocumentTemplateRepository) Search(criteria models.DocumentTemplateSearch) ([]models.DocumentTemplate, error) {
	var templates []models.DocumentTemplate
	query := r.DB.Model(&models.DocumentTemplate{})

	if criteria.Query != "" {
		searchTerm := "%" + criteria.Query + "%"
		query = query.Where("name LIKE ? OR file_name LIKE ?", searchTerm, searchTerm)
	}

	err := query.Find(&templates).Error
	return templates, err
}

func (r *DocumentTemplateRepository) GetAll() ([]models.DocumentTemplate, error) {
	var templates []models.DocumentTemplate
	err := r.DB.Find(&templates).Error
	return templates, err
}

func (r *DocumentTemplateRepository) Create(tmpl *models.DocumentTemplate) error {
	return r.DB.Create(tmpl).Error
}
