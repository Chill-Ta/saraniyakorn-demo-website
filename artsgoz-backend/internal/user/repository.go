package user

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
	"gorm.io/gorm"
)

const uniqueViolation = "23505"

type Repository interface {
	CreateUser(context.Context, *User) error
}

type UserRepository interface {
	Repository
	FindByID(ctx context.Context, id string) (*User, error)
	FindByUsername(ctx context.Context, username string) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)
	GetAllUsers() ([]*User, error)
	UpdateProfile(id string, email string) (*User, error)
}

type GormRepository struct {
	db *gorm.DB
}

var _ Repository = (*GormRepository)(nil)
var _ UserRepository = (*GormRepository)(nil)

func NewGormRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return NewGormRepository(db)
}

func (r *GormRepository) CreateUser(ctx context.Context, item *User) error {
	if item == nil {
		return fmt.Errorf("create user: user is nil")
	}
	err := r.db.WithContext(ctx).Create(item).Error
	if err == nil {
		return nil
	}
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return ErrEmailAlreadyExists
	}
	var postgresError *pgconn.PgError
	if errors.As(err, &postgresError) && postgresError.Code == uniqueViolation {
		return ErrEmailAlreadyExists
	}
	return fmt.Errorf("create user: %w", err)
}

func (r *GormRepository) FindByID(ctx context.Context, id string) (*User, error) {
	var u User
	err := r.db.WithContext(ctx).Where("id = ?", id).Take(&u).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *GormRepository) FindByUsername(ctx context.Context, username string) (*User, error) {
	var u User
	err := r.db.WithContext(ctx).Where("username = ?", username).Take(&u).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *GormRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
	var u User
	err := r.db.WithContext(ctx).Where("email = ?", email).Take(&u).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *GormRepository) GetAllUsers() ([]*User, error) {
	var users []*User
	if err := r.db.Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *GormRepository) UpdateProfile(id string, email string) (*User, error) {
	result := r.db.Model(&User{}).Where("id = ?", id).Updates(map[string]any{
		"email":      email,
		"updated_at": time.Now().UTC(),
	})
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected == 0 {
		return nil, errors.New("user not found")
	}
	return r.FindByID(context.Background(), id)
}
