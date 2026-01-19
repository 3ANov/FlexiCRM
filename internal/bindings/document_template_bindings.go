package bindings

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/services"
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type DocumentTemplateBindings struct {
	ctx     context.Context
	service *services.DocumentTemplateService
}

func (b *DocumentTemplateBindings) SetContext(ctx context.Context) {
	b.ctx = ctx
}

func NewDocumentTemplateBindings(s *services.DocumentTemplateService) *DocumentTemplateBindings {
	return &DocumentTemplateBindings{service: s}
}

func (b *DocumentTemplateBindings) GetAll() ([]models.DocumentTemplate, error) {
	return b.service.GetAll()
}

func (b *DocumentTemplateBindings) GetByID(id uint) (*models.DocumentTemplate, error) {
	return b.service.GetByID(id)
}

func (b *DocumentTemplateBindings) Create(tmpl *models.DocumentTemplate) error {
	return b.service.Create(tmpl)
}

func (b *DocumentTemplateBindings) Update(tmpl *models.DocumentTemplate) error {
	return b.service.Update(tmpl)
}

func (b *DocumentTemplateBindings) Delete(id uint) error {
	return b.service.Delete(id)
}

func (b *DocumentTemplateBindings) AutoScan(filePath string) ([]string, error) {
	return b.service.ScanTemplate(filePath)
}

func (b *DocumentTemplateBindings) PickAndScanTemplate() (*models.ScanResult, error) {
	filePath, err := runtime.OpenFileDialog(b.ctx, runtime.OpenDialogOptions{
		Title: "Выберите шаблон Word (.docx)",
		Filters: []runtime.FileFilter{
			{DisplayName: "Word Documents (*.docx)", Pattern: "*.docx"},
		},
	})

	if err != nil || filePath == "" {
		return nil, err
	}

	keys, err := b.service.ScanTemplate(filePath)
	if err != nil {
		return nil, err
	}

	return &models.ScanResult{
		FilePath: filePath,
		Keys:     keys,
	}, nil
}
