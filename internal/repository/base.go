package repository

import "gorm.io/gorm"

type Repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) Create(model any) error {
	return r.DB.Create(model).Error
}

func (r *Repository) Update(model any) error {
	return r.DB.Save(model).Error
}

func (r *Repository) Delete(modelType any, id uint) error {
	return r.DB.Model(modelType).Delete(modelType, id).Error
}
