package repository

import (
	"FlexiCRM/internal/models"
)

type ClientDocumentRepository struct {
	*Repository
}

func NewClientDocumentRepository(r *Repository) *ClientDocumentRepository {
	return &ClientDocumentRepository{r}
}

func (r *ClientDocumentRepository) GetByID(id uint) (*models.ClientDocument, error) {
	var doc models.ClientDocument
	err := r.DB.First(&doc, id).Error
	return &doc, err
}

func (r *ClientDocumentRepository) GetAll() ([]models.ClientDocument, error) {
	var docs []models.ClientDocument
	err := r.DB.Find(&docs).Error
	return docs, err
}

func (r *ClientDocumentRepository) Search(filter models.ClientDocumentSearch) ([]models.ClientDocument, error) {
	db := r.DB

	if filter.ClientID != nil {
		db = db.Where("client_id = ?", *filter.ClientID)
	}

	if filter.TemplateID != nil {
		db = db.Where("template_id = ?", *filter.TemplateID)
	}

	var documents []models.ClientDocument
	err := db.Find(&documents).Error
	return documents, err
}
