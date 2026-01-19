package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
)

type ClientDocumentService struct {
	*BaseService
	Repo            *repository.ClientDocumentRepository
	TemplateService *DocumentTemplateService
}

func NewClientDocumentService(
	repo *repository.ClientDocumentRepository,
	tmplService *DocumentTemplateService,
	base *BaseService,
) *ClientDocumentService {
	return &ClientDocumentService{
		BaseService:     base,
		Repo:            repo,
		TemplateService: tmplService,
	}
}

func (s *ClientDocumentService) GetByID(id uint) (*models.ClientDocument, error) {
	return s.Repo.GetByID(id)
}

func (s *ClientDocumentService) GetAll() ([]models.ClientDocument, error) {
	return s.Repo.GetAll()
}

func (s *ClientDocumentService) Delete(id uint) error {
	return s.Repo.Delete(&models.ClientDocument{}, id)
}

func (s *ClientDocumentService) Search(filters models.ClientDocumentSearch) ([]models.ClientDocument, error) {
	return s.Repo.Search(filters)
}

func (s *ClientDocumentService) GenerateFile(docID uint) ([]byte, string, error) {
	doc, err := s.Repo.GetByID(docID)
	if err != nil {
		return nil, "", err
	}

	return s.TemplateService.RenderById(uint(doc.TemplateID), doc.Data)
}

func (s *ClientDocumentService) GetByClientID(empID uint) ([]models.ClientDocument, error) {
	return s.Repo.GetByClientID(empID)
}
