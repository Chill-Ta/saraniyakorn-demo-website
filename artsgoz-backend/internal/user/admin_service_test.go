package user_test

import (
	"context"
	"testing"
	"time"

	"github.com/artsgoz/artsgoz-backend/internal/user"
)

type mockUserRepository struct {
	users map[string]*user.User
}

func newMockUserRepository() *mockUserRepository {
	return &mockUserRepository{
		users: make(map[string]*user.User),
	}
}

func (m *mockUserRepository) FindByID(ctx context.Context, id string) (*user.User, error) {
	return m.users[id], nil
}

func (m *mockUserRepository) FindByUsername(ctx context.Context, username string) (*user.User, error) {
	for _, u := range m.users {
		if u.Username == username {
			return u, nil
		}
	}
	return nil, nil
}

func (m *mockUserRepository) FindByEmail(ctx context.Context, email string) (*user.User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, nil
}

func (m *mockUserRepository) CreateUser(ctx context.Context, u *user.User) error {
	m.users[u.ID] = u
	return nil
}

func (m *mockUserRepository) GetAllUsers() ([]*user.User, error) {
	var list []*user.User
	for _, u := range m.users {
		list = append(list, u)
	}
	return list, nil
}

func (m *mockUserRepository) UpdateProfile(id string, email string) (*user.User, error) {
	if u, ok := m.users[id]; ok {
		u.Email = email
		u.UpdatedAt = time.Now()
		return u, nil
	}
	return nil, nil
}

func TestAdminService_GetProfile(t *testing.T) {
	repo := newMockUserRepository()
	repo.users["u1"] = &user.User{
		ID:       "u1",
		Username: "admin1",
		Email:    "admin@example.com",
	}

	adminSvc := user.NewAdminService(repo)

	profile, err := adminSvc.GetProfile("u1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if profile.Username != "admin1" {
		t.Errorf("expected username 'admin1', got %s", profile.Username)
	}
}

func TestAdminService_UpdateProfile(t *testing.T) {
	repo := newMockUserRepository()
	repo.users["u1"] = &user.User{
		ID:       "u1",
		Username: "admin1",
		Email:    "old@example.com",
	}

	adminSvc := user.NewAdminService(repo)

	updated, err := adminSvc.UpdateProfile("u1", user.UpdateProfileRequest{
		Email: "new@example.com",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if updated.Email != "new@example.com" {
		t.Errorf("expected email 'new@example.com', got %s", updated.Email)
	}
}

