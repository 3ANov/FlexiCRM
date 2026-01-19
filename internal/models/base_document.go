package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type DocumentData map[string]string

func (d DocumentData) Value() (driver.Value, error) {
	if len(d) == 0 {
		return "{}", nil
	}
	return json.Marshal(d)
}

func (d *DocumentData) Scan(value interface{}) error {
	if value == nil {
		*d = make(DocumentData)
		return nil
	}
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("несовместимый тип для DocumentData")
	}
	return json.Unmarshal(bytes, d)
}

type BaseDocument struct {
	ID         uint             `gorm:"primaryKey" json:"ID"`
	TemplateID uint             `json:"TemplateID"`
	Template   DocumentTemplate `gorm:"foreignKey:TemplateID" json:"Template"`
	Data       DocumentData     `gorm:"type:text" json:"Data"`
	CreatedAt  time.Time        `json:"CreatedAt"`
}
