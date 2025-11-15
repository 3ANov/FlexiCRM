package repository

import (
	"FlexiCRM/internal/models"
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

func (r *ProjectRepository) Search(filter models.ProjectSearch) ([]models.Project, error) {
	db := r.DB

	if filter.Query != "" {
		pattern := "%" + strings.ToLower(filter.Query) + "%"
		db = db.Where(`
			LOWER(name) LIKE ? OR
			LOWER(description) LIKE ? OR
			LOWER(status) LIKE ?
		`, pattern, pattern, pattern)
	}

	if filter.ClientID != nil {
		db = db.Where("client_id = ?", *filter.ClientID)
	}

	if filter.Status != "" {
		db = db.Where("status = ?", filter.Status)
	}

	var projects []models.Project
	err := db.Find(&projects).Error
	return projects, err
}
