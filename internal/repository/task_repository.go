package repository

import (
	"FlexiCRM/internal/models"
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

func (r *TaskRepository) GetByProjectID(projectID uint) ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Preload("Employee").Where("project_id = ?", projectID).Find(&tasks).Error
	return tasks, err
}

func (r *TaskRepository) GetAll() ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Preload("Employee").Find(&tasks).Error
	return tasks, err
}

func (r *TaskRepository) GetByEmployee(employeeID uint) ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Where("assigned_to = ?", employeeID).Find(&tasks).Error
	return tasks, err
}

func (r *TaskRepository) GetByStatus(status string) ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Where("status = ?", status).Find(&tasks).Error
	return tasks, err
}
