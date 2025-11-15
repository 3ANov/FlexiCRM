package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type ClientDocumentBindings struct {
	service *services.ClientDocumentService
}

func NewClientDocumentBindings(s *services.ClientDocumentService) *ClientDocumentBindings {
	return &ClientDocumentBindings{service: s}
}

func (b *ClientDocumentBindings) GetAll() ([]models.ClientDocument, error) {
	return b.service.GetAll()
}

func (b *ClientDocumentBindings) GetByID(id uint) (*models.ClientDocument, error) {
	return b.service.GetByID(id)
}

func (b *ClientDocumentBindings) Create(doc *models.ClientDocument) error {
	return b.service.Create(doc)
}

func (b *ClientDocumentBindings) Update(doc *models.ClientDocument) error {
	return b.service.Update(doc)
}

func (b *ClientDocumentBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (s *ClientDocumentBindings) Search(filters models.ClientDocumentSearch) ([]models.ClientDocument, error) {
	return s.service.Search(filters)
}
