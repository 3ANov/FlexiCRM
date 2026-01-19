package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type EmployeeDocumentBindings struct {
	ctx     context.Context
	service *services.EmployeeDocumentService
}

func NewEmployeeDocumentBindings(s *services.EmployeeDocumentService) *EmployeeDocumentBindings {
	return &EmployeeDocumentBindings{service: s}
}

func (b *EmployeeDocumentBindings) SetContext(ctx context.Context) {
	b.ctx = ctx
}

func (b *EmployeeDocumentBindings) GetAll() ([]models.EmployeeDocument, error) {
	return b.service.GetAll()
}

func (b *EmployeeDocumentBindings) GetByID(id uint) (*models.EmployeeDocument, error) {
	return b.service.GetByID(id)
}

func (b *EmployeeDocumentBindings) Create(doc *models.EmployeeDocument) error {
	return b.service.Create(doc)
}

func (b *EmployeeDocumentBindings) Update(doc *models.EmployeeDocument) error {
	return b.service.Update(doc)
}

func (b *EmployeeDocumentBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (s *EmployeeDocumentBindings) Search(filters models.EmployeeDocumentSearch) ([]models.EmployeeDocument, error) {
	return s.service.Search(filters)
}

func (b *EmployeeDocumentBindings) GenerateAndSave(docID uint) (string, error) {
	fileBytes, fileName, err := b.service.GenerateFile(docID)
	if err != nil {
		return "", err
	}

	filePath, err := runtime.SaveFileDialog(b.ctx, runtime.SaveDialogOptions{
		DefaultFilename: fileName,
		Title:           "Сохранить документ",
		Filters: []runtime.FileFilter{
			{DisplayName: "Word Document (*.docx)", Pattern: "*.docx"},
		},
	})

	if err != nil || filePath == "" {
		return "Cancelled", nil
	}

	if err := os.WriteFile(filePath, fileBytes, 0644); err != nil {
		return "", err
	}

	return filePath, nil
}

func (b *EmployeeDocumentBindings) DownloadDocument(docID uint) error {
	doc, err := b.service.GetByID(docID)
	if err != nil {
		return err
	}

	tmplName := "Doc"
	if doc.Template.Name != "" {
		tmplName = doc.Template.Name
	}
	dateStr := doc.CreatedAt.Format("2006-01-02")
	defaultName := fmt.Sprintf("%s_Emp%d_%s.docx", tmplName, doc.EmployeeID, dateStr)

	safeName := strings.ReplaceAll(defaultName, " ", "_")

	savePath, err := runtime.SaveFileDialog(b.ctx, runtime.SaveDialogOptions{
		Title:           "Сохранить документ",
		DefaultFilename: safeName,
		Filters: []runtime.FileFilter{
			{DisplayName: "Word Document (*.docx)", Pattern: "*.docx"},
		},
	})

	if err != nil || savePath == "" {
		return err
	}

	content, _, err := b.service.GenerateFile(docID)
	if err != nil {
		return err
	}

	return os.WriteFile(savePath, content, 0644)
}

func (b *EmployeeDocumentBindings) GetByEmployeeID(empID uint) ([]models.EmployeeDocument, error) {
	return b.service.GetByEmployeeID(empID)
}

func (b *EmployeeDocumentBindings) Save(doc *models.EmployeeDocument) error {
	if doc.ID > 0 {
		return b.service.Update(doc)
	}
	return b.service.Create(doc)
}
