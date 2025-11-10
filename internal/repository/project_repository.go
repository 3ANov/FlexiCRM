package repository

import (
	"FlexiCRM/internal/models"
	"fmt"
	"strings"
)

type ProjectRepository struct {
	*Repository
}

func NewProjectRepository(r *Repository) *ProjectRepository {
	return &ProjectRepository{r}
}

func (r *ProjectRepository) GetByID(id uint) (*models.Project, error) {
	var project models.Project
	err := r.DB.Preload("Tasks").First(&project, id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) GetAll() ([]models.Project, error) {
	var projects []models.Project
	err := r.DB.Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) GetByClient(clientID uint) ([]models.Project, error) {
	var projects []models.Project
	err := r.DB.Where("client_id = ?", clientID).Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) GetByStatus(status string) ([]models.Project, error) {
	var projects []models.Project
	err := r.DB.Where("status = ?", status).Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) Search(query string) ([]models.Project, error) {
	var projects []models.Project
	pattern := fmt.Sprintf("%%%s%%", strings.ToLower(query))
	err := r.DB.
		Where(`
			LOWER(name) LIKE ? OR
			LOWER(description) LIKE ? OR
			LOWER(status) LIKE ?
		`, pattern, pattern, pattern).
		Find(&projects).Error
	return projects, err
}
