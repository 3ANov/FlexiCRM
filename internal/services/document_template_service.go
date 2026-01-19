package services

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"

	"github.com/nguyenthenguyen/docx"
)

type DocumentTemplateService struct {
	*BaseService
	Repo         *repository.DocumentTemplateRepository
	TemplatesDir string
}

func NewDocumentTemplateService(repo *repository.DocumentTemplateRepository, tDir string, base *BaseService) *DocumentTemplateService {
	return &DocumentTemplateService{
		BaseService:  base,
		Repo:         repo,
		TemplatesDir: tDir,
	}
}

func (s *DocumentTemplateService) GetByID(id uint) (*models.DocumentTemplate, error) {
	return s.Repo.GetByID(id)
}

func (s *DocumentTemplateService) Search(filters models.DocumentTemplateSearch) ([]models.DocumentTemplate, error) {
	return s.Repo.Search(filters)
}

func (s *DocumentTemplateService) GetAll() ([]models.DocumentTemplate, error) {
	return s.Repo.GetAll()
}

func (s *DocumentTemplateService) RenderById(templateID uint, data map[string]string) ([]byte, string, error) {
	tmpl, err := s.Repo.GetByID(templateID)
	if err != nil {
		return nil, "", fmt.Errorf("шаблон не найден: %w", err)
	}

	path := filepath.Join(s.TemplatesDir, tmpl.FileName)

	r, err := docx.ReadDocxFile(path)
	if err != nil {
		return nil, "", fmt.Errorf("не удалось прочитать файл: %w", err)
	}
	defer r.Close()

	doc := r.Editable()

	for key, value := range data {
		placeholder := "{{" + key + "}}"
		doc.Replace(placeholder, value, -1) // -1 значит заменить все вхождения
	}

	var buf bytes.Buffer
	err = doc.Write(&buf)
	if err != nil {
		return nil, "", fmt.Errorf("ошибка при записи документа: %w", err)
	}

	return buf.Bytes(), tmpl.FileName, nil
}

func (s *DocumentTemplateService) Create(tmpl *models.DocumentTemplate) error {
	if filepath.IsAbs(tmpl.FileName) {
		if err := s.saveTemplateFile(tmpl); err != nil {
			return err
		}
	}
	return s.Repo.Create(tmpl)
}

func (s *DocumentTemplateService) Update(tmpl *models.DocumentTemplate) error {
	if filepath.IsAbs(tmpl.FileName) {
		if err := s.saveTemplateFile(tmpl); err != nil {
			return err
		}
	}
	return s.Repo.DB.Save(tmpl).Error
}

func (s *DocumentTemplateService) saveTemplateFile(tmpl *models.DocumentTemplate) error {
	srcPath := tmpl.FileName
	fileNameOnly := filepath.Base(srcPath)
	dstPath := filepath.Join(s.TemplatesDir, fileNameOnly)

	if err := copyFile(srcPath, dstPath); err != nil {
		return fmt.Errorf("не удалось сохранить файл шаблона: %w", err)
	}

	tmpl.FileName = fileNameOnly
	return nil
}

func copyFile(src, dst string) error {
	source, err := os.Open(src)
	if err != nil {
		return err
	}
	defer source.Close()

	destination, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destination.Close()

	_, err = io.Copy(destination, source)
	return err
}

func (s *DocumentTemplateService) Delete(id uint) error {
	return s.Repo.Delete(&models.DocumentTemplate{}, id)
}

func (s *DocumentTemplateService) ScanTemplate(filePath string) ([]string, error) {
	r, err := zip.OpenReader(filePath)
	if err != nil {
		return nil, err
	}
	defer r.Close()

	var fullXml strings.Builder
	for _, f := range r.File {
		if f.Name == "word/document.xml" || strings.Contains(f.Name, "header") || strings.Contains(f.Name, "footer") {
			rc, err := f.Open()
			if err != nil {
				return nil, err
			}
			_, _ = io.Copy(&fullXml, rc)
			rc.Close()
		}
	}

	cleanText := regexp.MustCompile("<[^>]*>").ReplaceAllString(fullXml.String(), "")

	re := regexp.MustCompile(`{{([^{}]+)}}`)
	matches := re.FindAllStringSubmatch(cleanText, -1)

	uniqueKeys := make(map[string]bool)
	var result []string

	for _, m := range matches {
		key := strings.TrimSpace(m[1])
		if key != "" && !uniqueKeys[key] {
			uniqueKeys[key] = true
			result = append(result, key)
		}
	}

	return result, nil
}
