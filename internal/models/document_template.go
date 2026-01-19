package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type DocumentTemplate struct {
	ID        uint           `gorm:"primaryKey"`
	Name      string         `json:"Name"`
	FileName  string         `json:"FileName"`
	Fields    TemplateFields `gorm:"type:text" json:"Fields"`
	CreatedAt time.Time      `json:"CreatedAt"`
}

type TemplateField struct {
	Key      string `json:"key"`
	Label    string `json:"label"`
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type TemplateFields []TemplateField

func (tf TemplateFields) Value() (driver.Value, error) {
	if len(tf) == 0 {
		return "[]", nil
	}
	return json.Marshal(tf)
}

func (tf *TemplateFields) Scan(value interface{}) error {
	if value == nil {
		*tf = []TemplateField{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("тип данных для TemplateFields должен быть []byte")
	}
	return json.Unmarshal(bytes, tf)
}

type ScanResult struct {
	FilePath string   `json:"FilePath"`
	Keys     []string `json:"Keys"`
}
