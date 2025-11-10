package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type TaskBindings struct {
	service *services.TaskService
}

func NewTaskBindings(s *services.TaskService) *TaskBindings {
	return &TaskBindings{service: s}
}

func (b *TaskBindings) GetAll() ([]models.Task, error) {
	return b.service.GetAll()
}

func (b *TaskBindings) GetByID(id uint) (*models.Task, error) {
	return b.service.GetByID(id)
}

func (b *TaskBindings) Create(task *models.Task) error {
	return b.service.Create(task)
}

func (b *TaskBindings) Update(task *models.Task) error {
	return b.service.Update(task)
}

func (b *TaskBindings) Delete(id uint) error {
	return b.service.Delete(id)
}
