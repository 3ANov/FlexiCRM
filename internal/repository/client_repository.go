package repository

import (
	"FlexiCRM/internal/models"
)

type ClientRepository struct {
	*Repository
}

func NewClientRepository(r *Repository) *ClientRepository {
	return &ClientRepository{r}
}

func (r *ClientRepository) GetByID(id uint) (*models.Client, error) {
	var client models.Client
	err := r.DB.
		Preload("Projects").
		Preload("Notes").
		Preload("Documents").
		First(&client, id).Error
	if err != nil {
		return nil, err
	}
	return &client, nil
}

func (r *ClientRepository) GetAll() ([]models.Client, error) {
	var clients []models.Client
	err := r.DB.Find(&clients).Error
	return clients, err
}

func (r *ClientRepository) Search(query string) ([]models.Client, error) {
	var clients []models.Client
	err := r.DB.
		Where("name LIKE ? OR phone LIKE ? OR email LIKE ?",
			"%"+query+"%", "%"+query+"%", "%"+query+"%").
		Find(&clients).Error
	return clients, err
}
