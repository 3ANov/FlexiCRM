package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type NoteBindings struct {
	service *services.NoteService
}

func NewNoteBindings(s *services.NoteService) *NoteBindings {
	return &NoteBindings{service: s}
}

func (b *NoteBindings) GetAll() ([]models.Note, error) {
	return b.service.GetAll()
}

func (b *NoteBindings) GetByID(id uint) (*models.Note, error) {
	return b.service.GetByID(id)
}

func (b *NoteBindings) Create(note *models.Note) error {
	return b.service.Create(note)
}

func (b *NoteBindings) Update(note *models.Note) error {
	return b.service.Update(note)
}

func (b *NoteBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (b *NoteBindings) Search(filters models.NoteSearch) ([]models.Note, error) {
	return b.service.Search(filters)
}
