package repository

import (
	"FlexiCRM/internal/models"
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

func (r *TransactionRepository) Search(filters models.TransactionSearch) ([]models.Transaction, error) {
	var txs []models.Transaction
	db := r.DB

	if filters.Query != "" {
		pattern := "%" + strings.ToLower(filters.Query) + "%"
		db = db.Where(`LOWER(notes) LIKE ?`, pattern)
	}

	if filters.Type != "" {
		db = db.Where("type = ?", filters.Type)
	}

	if filters.Category != "" {
		db = db.Where("category = ?", filters.Category)
	}

	if filters.DateFrom != nil {
		db = db.Where("date >= ?", *filters.DateFrom)
	}
	if filters.DateTo != nil {
		db = db.Where("date <= ?", *filters.DateTo)
	}

	if filters.MinAmount != nil {
		db = db.Where("amount >= ?", *filters.MinAmount)
	}
	if filters.MaxAmount != nil {
		db = db.Where("amount <= ?", *filters.MaxAmount)
	}

	err := db.Find(&txs).Error
	return txs, err
}
