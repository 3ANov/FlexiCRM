package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type NoteService struct {
	*BaseService
	Repo *repository.NoteRepository
}

func NewNoteService(repo *repository.NoteRepository, base *BaseService) *NoteService {
	return &NoteService{
		BaseService: base,
		Repo:        repo,
	}
}

func (s *NoteService) GetByID(id uint) (*models.Note, error) {
	return s.Repo.GetByID(id)
}

func (s *NoteService) GetAll() ([]models.Note, error) {
	return s.Repo.GetAll()
}

func (s *NoteService) Search(query string) ([]models.Note, error) {
	return s.Repo.Search(query)
}
