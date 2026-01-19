package models

type ClientDocument struct {
	BaseDocument
	ClientID uint `json:"ClientID"`
}
