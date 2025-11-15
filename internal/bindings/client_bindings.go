package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type ClientBindings struct {
	service *services.ClientService
}

func NewClientBindings(s *services.ClientService) *ClientBindings {
	return &ClientBindings{service: s}
}

func (b *ClientBindings) GetAll() ([]models.Client, error) {
	return b.service.GetAll()
}

func (b *ClientBindings) GetByID(id uint) (*models.Client, error) {
	return b.service.GetByID(id)
}

func (b *ClientBindings) Search(filters models.ClientSearch) ([]models.Client, error) {
	return b.service.Search(filters)
}

func (b *ClientBindings) Create(client *models.Client) error {
	return b.service.Create(client)
}

func (b *ClientBindings) Update(client *models.Client) error {
	return b.service.Update(client)
}

func (b *ClientBindings) Delete(id uint) error {
	return b.service.Delete(id)
}
