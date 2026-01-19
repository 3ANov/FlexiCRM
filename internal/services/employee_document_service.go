package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type EmployeeDocumentService struct {
	*BaseService
	Repo            *repository.EmployeeDocumentRepository
	TemplateService *DocumentTemplateService
}

func NewEmployeeDocumentService(
	repo *repository.EmployeeDocumentRepository,
	tmplService *DocumentTemplateService,
	base *BaseService,
) *EmployeeDocumentService {
	return &EmployeeDocumentService{
		BaseService:     base,
		Repo:            repo,
		TemplateService: tmplService,
	}
}

func (s *EmployeeDocumentService) GetByID(id uint) (*models.EmployeeDocument, error) {
	return s.Repo.GetByID(id)
}

func (s *EmployeeDocumentService) GetAll() ([]models.EmployeeDocument, error) {
	return s.Repo.GetAll()
}

func (s *EmployeeDocumentService) Delete(id uint) error {
	return s.Repo.Delete(&models.EmployeeDocument{}, id)
}

func (s *EmployeeDocumentService) Search(filters models.EmployeeDocumentSearch) ([]models.EmployeeDocument, error) {
	return s.Repo.Search(filters)
}

func (s *EmployeeDocumentService) GenerateFile(docID uint) ([]byte, string, error) {
	doc, err := s.Repo.GetByID(docID)
	if err != nil {
		return nil, "", err
	}

	return s.TemplateService.RenderById(uint(doc.TemplateID), doc.Data)
}

func (s *EmployeeDocumentService) GetByEmployeeID(empID uint) ([]models.EmployeeDocument, error) {
	return s.Repo.GetByEmployeeID(empID)
}

func (s *EmployeeDocumentService) Save(doc *models.EmployeeDocument) error {
	if doc.ID > 0 {
		return s.Repo.DB.Save(doc).Error
	}
	return s.Repo.Create(doc)
}
