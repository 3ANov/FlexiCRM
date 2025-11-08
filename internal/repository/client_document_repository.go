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

func (r *ClientDocumentRepository) Create(doc *models.ClientDocument) error {
	return r.DB.Create(doc).Error
}

func (r *ClientDocumentRepository) GetByID(id int) (*models.ClientDocument, error) {
	var doc models.ClientDocument
	err := r.DB.First(&doc, id).Error
	return &doc, err
}

func (r *ClientDocumentRepository) GetByClient(clientID int) ([]models.ClientDocument, error) {
	var docs []models.ClientDocument
	err := r.DB.Where("client_id = ?", clientID).Find(&docs).Error
	return docs, err
}

func (r *ClientDocumentRepository) Update(doc *models.ClientDocument) error {
	return r.DB.Save(doc).Error
}

func (r *ClientDocumentRepository) Delete(id int) error {
	return r.DB.Delete(&models.ClientDocument{}, id).Error
}
