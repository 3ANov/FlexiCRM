package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
)

type ProjectBindings struct {
	service *services.ProjectService
}

func NewProjectBindings(s *services.ProjectService) *ProjectBindings {
	return &ProjectBindings{service: s}
}

func (b *ProjectBindings) GetAll() ([]models.Project, error) {
	return b.service.GetAll()
}

func (b *ProjectBindings) GetByID(id uint) (*models.Project, error) {
	return b.service.GetByID(id)
}

func (b *ProjectBindings) Create(project *models.Project) error {
	return b.service.Create(project)
}

func (b *ProjectBindings) Update(project *models.Project) error {
	return b.service.Update(project)
}

func (b *ProjectBindings) Delete(project *models.Project, id uint) error {
	return b.service.Delete(project, id)
}
