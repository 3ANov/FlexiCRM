package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type TransactionBindings struct {
	service *services.TransactionService
}

func NewTransactionBindings(s *services.TransactionService) *TransactionBindings {
	return &TransactionBindings{service: s}
}

func (b *TransactionBindings) GetAll() ([]models.Transaction, error) {
	return b.service.GetAll()
}

func (b *TransactionBindings) GetByID(id uint) (*models.Transaction, error) {
	return b.service.GetByID(id)
}

func (b *TransactionBindings) Create(tx *models.Transaction) error {
	return b.service.Create(tx)
}

func (b *TransactionBindings) Update(tx *models.Transaction) error {
	return b.service.Update(tx)
}

func (b *TransactionBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (b *TransactionBindings) Search(query string) ([]models.Transaction, error) {
	return b.service.Search(query)
}
