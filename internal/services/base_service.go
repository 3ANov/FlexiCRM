package services

import (
	"FlexiCRM/internal/repository"
)

type BaseService struct {
	Repo *repository.Repository
}

func NewBaseService(repo *repository.Repository) *BaseService {
	return &BaseService{Repo: repo}
}

func (s *BaseService) Create(model any) error {
	return s.Repo.Create(model)
}

func (s *BaseService) Update(model any) error {
	return s.Repo.Update(model)
}
