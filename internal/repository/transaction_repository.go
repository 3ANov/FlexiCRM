package repository

import (
	"FlexiCRM/internal/models"
	"fmt"
	"strings"
)

type TransactionRepository struct {
	*Repository
}

func NewTransactionRepository(r *Repository) *TransactionRepository {
	return &TransactionRepository{r}
}

func (r *TransactionRepository) GetByID(id uint) (*models.Transaction, error) {
	var tx models.Transaction
	err := r.DB.First(&tx, id).Error
	if err != nil {
		return nil, err
	}
	return &tx, nil
}

func (r *TransactionRepository) GetAll() ([]models.Transaction, error) {
	var txs []models.Transaction
	err := r.DB.Find(&txs).Error
	return txs, err
}

func (r *TransactionRepository) GetByType(txType string) ([]models.Transaction, error) {
	var txs []models.Transaction
	err := r.DB.Where("type = ?", txType).Find(&txs).Error
	return txs, err
}

func (r *TransactionRepository) GetByCategory(category string) ([]models.Transaction, error) {
	var txs []models.Transaction
	err := r.DB.Where("category = ?", category).Find(&txs).Error
	return txs, err
}

func (r *TransactionRepository) Search(query string) ([]models.Transaction, error) {
	var txs []models.Transaction
	pattern := fmt.Sprintf("%%%s%%", strings.ToLower(query))

	err := r.DB.
		Where("LOWER(type) LIKE ? OR LOWER(category) LIKE ? OR LOWER(notes) LIKE ?", pattern, pattern, pattern).
		Find(&txs).Error

	return txs, err
}
