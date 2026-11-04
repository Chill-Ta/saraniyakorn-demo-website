package auth

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/artsgoz/artsgoz-backend/internal/user"
)

type UserRepository interface {
	FindByID(ctx context.Context, id string) (*user.User, error)
	FindByUsername(ctx context.Context, username string) (*user.User, error)
	FindByEmail(ctx context.Context, email string) (*user.User, error)
	CreateUser(ctx context.Context, profile *user.User) error
}

type Service struct {
	users      UserRepository
	jwtManager *JWTManager
}

func NewService(users UserRepository, jwtManager *JWTManager) *Service {
	return &Service{users: users, jwtManager: jwtManager}
}

func (s *Service) Register(ctx context.Context, req RegisterRequest) (*user.User, string, error) {
	username := strings.TrimSpace(req.Username)
	if username == "" {
		return nil, "", errors.New("username is required")
	}

	existingUser, err := s.users.FindByUsername(ctx, username)
	if err != nil {
		return nil, "", err
	}
	if existingUser != nil {
		return nil, "", errors.New("username is already taken")
	}

	email := strings.TrimSpace(strings.ToLower(req.Email))
	if email != "" {
		existingEmail, err := s.users.FindByEmail(ctx, email)
		if err != nil {
			return nil, "", err
		}
		if existingEmail != nil {
			return nil, "", errors.New("email is already registered")
		}
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", errors.New("failed to encrypt password")
	}

	now := time.Now().UTC()
	newUser := &user.User{
		ID:           uuid.NewString(),
		Username:     username,
		Email:        email,
		PasswordHash: string(hashedPassword),
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	if err := s.users.CreateUser(ctx, newUser); err != nil {
		return nil, "", err
	}

	token, err := s.jwtManager.GenerateToken(newUser.ID, newUser.Username)
	if err != nil {
		return nil, "", errors.New("failed to generate access token")
	}

	return newUser, token, nil
}

func (s *Service) Login(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	username := strings.TrimSpace(req.Username)
	if username == "" || req.Password == "" {
		return nil, errors.New("username and password are required")
	}

	profile, err := s.users.FindByUsername(ctx, username)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, errors.New("invalid username or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(profile.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid username or password")
	}

	token, err := s.jwtManager.GenerateToken(profile.ID, profile.Username)
	if err != nil {
		return nil, errors.New("failed to generate access token")
	}

	return &LoginResponse{
		Token: token,
		User:  profile,
	}, nil
}

func (s *Service) GetProfile(ctx context.Context, id string) (*user.User, error) {
	return s.users.FindByID(ctx, id)
}

func (s *Service) ValidateToken(tokenString string) (*Claims, error) {
	return s.jwtManager.ValidateToken(tokenString)
}

