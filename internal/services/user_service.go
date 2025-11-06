package services

import (
	"FlexiCRM/internal/models"
	"FlexiCRM/internal/repository"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) Register(email, password string) error {
	_, err := s.repo.FindByEmail(email)
	if err == nil {
		return errors.New("пользователь с таким email уже существует")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		Email:    email,
		Password: string(hashed),
	}
	return s.repo.Create(user)
}

func (s *UserService) Login(email, password string) error {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return errors.New("пользователь не найден")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return errors.New("неверный пароль")
	}

	return nil
}
