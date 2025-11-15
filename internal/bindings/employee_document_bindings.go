package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type EmployeeDocumentBindings struct {
	service *services.EmployeeDocumentService
}

func NewEmployeeDocumentBindings(s *services.EmployeeDocumentService) *EmployeeDocumentBindings {
	return &EmployeeDocumentBindings{service: s}
}

func (b *EmployeeDocumentBindings) GetAll() ([]models.EmployeeDocument, error) {
	return b.service.GetAll()
}

func (b *EmployeeDocumentBindings) GetByID(id uint) (*models.EmployeeDocument, error) {
	return b.service.GetByID(id)
}

func (b *EmployeeDocumentBindings) Create(doc *models.EmployeeDocument) error {
	return b.service.Create(doc)
}

func (b *EmployeeDocumentBindings) Update(doc *models.EmployeeDocument) error {
	return b.service.Update(doc)
}

func (b *EmployeeDocumentBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (s *EmployeeDocumentBindings) Search(filters models.EmployeeDocumentSearch) ([]models.EmployeeDocument, error) {
	return s.service.Search(filters)
}
