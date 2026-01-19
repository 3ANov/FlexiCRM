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

type ClientDocumentBindings struct {
	ctx     context.Context
	service *services.ClientDocumentService
}

func NewClientDocumentBindings(s *services.ClientDocumentService) *ClientDocumentBindings {
	return &ClientDocumentBindings{service: s}
}

func (b *ClientDocumentBindings) SetContext(ctx context.Context) {
	b.ctx = ctx
}

func (b *ClientDocumentBindings) GetAll() ([]models.ClientDocument, error) {
	return b.service.GetAll()
}

func (b *ClientDocumentBindings) GetByID(id uint) (*models.ClientDocument, error) {
	return b.service.GetByID(id)
}

func (b *ClientDocumentBindings) Create(doc *models.ClientDocument) error {
	return b.service.Create(doc)
}

func (b *ClientDocumentBindings) Update(doc *models.ClientDocument) error {
	return b.service.Update(doc)
}

func (b *ClientDocumentBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (s *ClientDocumentBindings) Search(filters models.ClientDocumentSearch) ([]models.ClientDocument, error) {
	return s.service.Search(filters)
}

func (b *ClientDocumentBindings) GenerateAndSave(docID uint) (string, error) {
	fileBytes, fileName, err := b.service.GenerateFile(docID)
	if err != nil {
		return "", err
	}

	filePath, err := runtime.SaveFileDialog(b.ctx, runtime.SaveDialogOptions{
		DefaultFilename: fileName,
		Title:           "Сохранить документ клиента",
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

func (b *ClientDocumentBindings) DownloadDocument(docID uint) error {
	doc, err := b.service.GetByID(docID)
	if err != nil {
		return err
	}

	tmplName := "Doc"
	if doc.Template.Name != "" {
		tmplName = doc.Template.Name
	}

	dateStr := doc.CreatedAt.Format("2006-01-02")
	fileName := fmt.Sprintf("%s_Client%d_%s.docx", tmplName, doc.ClientID, dateStr)
	safeName := strings.ReplaceAll(fileName, " ", "_")

	savePath, err := runtime.SaveFileDialog(b.ctx, runtime.SaveDialogOptions{
		Title:           "Сохранить документ клиента",
		DefaultFilename: safeName,
		Filters:         []runtime.FileFilter{{DisplayName: "Word (*.docx)", Pattern: "*.docx"}},
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

func (b *ClientDocumentBindings) GetByClientID(empID uint) ([]models.ClientDocument, error) {
	return b.service.GetByClientID(empID)
}

func (b *ClientDocumentBindings) Save(doc *models.ClientDocument) error {
	if doc.ID > 0 {
		return b.service.Update(doc)
	}
	return b.service.Create(doc)
}
