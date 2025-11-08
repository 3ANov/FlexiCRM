package repository

import (
	"FlexiCRM/internal/models"
)

type NoteRepository struct {
	*Repository
}

func NewNoteRepository(r *Repository) *NoteRepository {
	return &NoteRepository{r}
}

func (r *NoteRepository) GetByID(id uint) (*models.Note, error) {
	var note models.Note
	err := r.DB.First(&note, id).Error
	if err != nil {
		return nil, err
	}
	return &note, nil
}

func (r *NoteRepository) GetAll() ([]models.Note, error) {
	var notes []models.Note
	err := r.DB.Find(&notes).Error
	return notes, err
}

func (r *NoteRepository) GetByClient(clientID uint) ([]models.Note, error) {
	var notes []models.Note
	err := r.DB.Where("client_id = ?", clientID).Find(&notes).Error
	return notes, err
}

func (r *NoteRepository) GetByDeal(dealID uint) ([]models.Note, error) {
	var notes []models.Note
	err := r.DB.Where("deal_id = ?", dealID).Find(&notes).Error
	return notes, err
}

func (r *NoteRepository) Search(query string) ([]models.Note, error) {
	var notes []models.Note
	err := r.DB.Where("content ILIKE ?", "%"+query+"%").Find(&notes).Error
	return notes, err
}
