package repository

import (
	"FlexiCRM/internal/models"
	"strings"
)

type TaskRepository struct {
	*Repository
}

func NewTaskRepository(r *Repository) *TaskRepository {
	return &TaskRepository{r}
}

func (r *TaskRepository) GetByID(id uint) (*models.Task, error) {
	var task models.Task
	err := r.DB.Preload("Employee").First(&task, id).Error
	return &task, err
}

func (r *TaskRepository) GetAll() ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Preload("Employee").Find(&tasks).Error
	return tasks, err
}

func (r *TaskRepository) Search(filters models.TaskSearch) ([]models.Task, error) {
	var tasks []models.Task
	db := r.DB

	if filters.Query != "" {
		pattern := "%" + strings.ToLower(filters.Query) + "%"
		db = db.Where(`
			LOWER(title) LIKE ? OR
			LOWER(description) LIKE ?
		`, pattern, pattern)
	}

	if filters.Status != "" {
		db = db.Where("status = ?", filters.Status)
	}

	if filters.AssignedTo != nil {
		db = db.Where("assigned_to = ?", *filters.AssignedTo)
	}

	if filters.ProjectID != nil {
		db = db.Where("project_id = ?", *filters.ProjectID)
	}

	if filters.Deadline != nil {
		db = db.Where("deadline <= ?", *filters.Deadline)
	}

	err := db.Find(&tasks).Error
	return tasks, err
}
