package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type TransactionService struct {
	*BaseService
	Repo *repository.TransactionRepository
}

func NewTransactionService(repo *repository.TransactionRepository, base *BaseService) *TransactionService {
	return &TransactionService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *TransactionService) GetByID(id uint) (*models.Transaction, error) {
	return s.Repo.GetByID(id)
}

func (s *TransactionService) GetAll() ([]models.Transaction, error) {
	return s.Repo.GetAll()
}
