package service

import (
	"carMaintenance/internal/entity"
	"carMaintenance/internal/errs"
	"carMaintenance/internal/repository"
	"carMaintenance/pkg/utilities"
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	repository *repository.User
}

// Create creates a new user in the system.
func (U *User) Create(ctx context.Context, user entity.UserDTO) (int, error) {
	if user.Email == "" || user.Password == "" {
		return 0, fmt.Errorf("UserService.Create: %w", errs.ErrInvalidInput)
	}

	existingUser, err := U.repository.GetByEmail(ctx, user.Email)
	if !errors.Is(err, errs.ErrNotFound) {
		return 0, fmt.Errorf("UserService.Create: %w", err)
	}

	if existingUser != nil {
		return 0, fmt.Errorf("UserService.Create: %w", errs.ErrAlreadyExists)
	}

	hashedPassword, err := utilities.HashPassword(user.Password)
	if err != nil {
		return 0, fmt.Errorf("UserService.Create.Hash: %w", err)
	}

	newUser := entity.UserDB{
		Email:        user.Email,
		PasswordHash: string(hashedPassword),
		IsVerified:   user.IsVerified,
		CreatedAt:    time.Now().String(),
	}

	newUser.Id, err = U.repository.Create(ctx, newUser)
	if err != nil {
		return 0, fmt.Errorf("UserService.Create: %w", err)
	}

	return newUser.Id, nil
}

// Update updates an existing user's details.
func (U *User) Update(ctx context.Context, userId int, user entity.UserDTO) error {
	if userId == 0 || user.Email == "" {
		return fmt.Errorf("UserService.Update: %w", errs.ErrInvalidInput)
	}

	existingUser, err := U.repository.GetById(ctx, userId)
	if err != nil {
		return fmt.Errorf("UserService.Update: %w", err)
	}

	if user.Password != "" {
		hashedPassword, err := utilities.HashPassword(user.Password)
		if err != nil {
			return fmt.Errorf("UserService.Update: %w", err)
		}
		existingUser.PasswordHash = string(hashedPassword)
	}
	existingUser.Email = user.Email
	existingUser.IsVerified = user.IsVerified
	existingUser.UpdatedAt = time.Now().String()

	err = U.repository.Update(ctx, *existingUser)
	if err != nil {
		return fmt.Errorf("UserService.Update: %w", err)
	}

	return nil
}

// GetByEmail retrieves a user by their email address.
func (U *User) GetByEmail(ctx context.Context, email string) (*entity.UserDTO, error) {
	if email == "" {
		return nil, fmt.Errorf("UserService.GetByEmail: %w", errs.ErrInvalidInput)
	}

	user, err := U.repository.GetByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("UserService.GetByEmail: %w", err)
	}

	return mapUserDBToDTO(*user), nil
}

// GetById retrieves a user by their ID.
func (U *User) GetById(ctx context.Context, userId int) (*entity.UserDTO, error) {
	if userId == 0 {
		return nil, fmt.Errorf("UserService.GetById: %w", errs.ErrInvalidInput)
	}

	user, err := U.repository.GetById(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("UserService.GetById: %w", err)
	}

	return mapUserDBToDTO(*user), nil
}

func (U *User) Authenticate(ctx context.Context, email, password string) (*entity.UserDTO, error) {
	if email == "" || password == "" {
		return nil, fmt.Errorf("UserService.Authenticate: %w", errs.ErrInvalidInput)
	}

	user, err := U.repository.GetByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("UserService.AuthenticateUser: %w", err)
	}

	if !user.IsVerified {
		return nil, fmt.Errorf("UserService.AuthenticateUser: %w", errs.ErrNotVerified)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, fmt.Errorf("UserService.AuthenticateUser: %w", err)
	}

	return mapUserDBToDTO(*user), nil
}

func (U *User) Verify(ctx context.Context, secretKey, hash string) error {
	users, err := U.repository.GetAll(ctx)
	if err != nil {
		return fmt.Errorf("UserService.Verify: %w", err)
	}

	for _, user := range users {
		if user.IsVerified {
			continue
		}

		if utilities.ValidateVerifyHash(secretKey, user.Email, user.Id, hash) {
			var updatedUser entity.UserDB

			updatedUser.IsVerified = true
			updatedUser.Id = user.Id
			updatedUser.PasswordHash = user.PasswordHash
			updatedUser.CreatedAt = user.CreatedAt
			updatedUser.UpdatedAt = time.Now().String()
			updatedUser.Email = user.Email
			err := U.repository.Update(ctx, updatedUser)
			if err != nil {
				return fmt.Errorf("UserService.Verify: %w", err)
			}

			return nil
		}
	}

	return fmt.Errorf("UserService.Verify: %w", errs.ErrNotFound)
}

// GetAll retrieves all users.
func (U *User) GetAll(ctx context.Context) ([]entity.UserDTO, error) {
	users, err := U.repository.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("UserService.GetAll: %w", err)
	}

	var userDTOs []entity.UserDTO
	for _, user := range users {
		userDTOs = append(userDTOs, *mapUserDBToDTO(user))
	}

	return userDTOs, nil
}

// Delete deletes a user by their ID.
func (U *User) DeleteById(ctx context.Context, userId int) error {
	if userId == 0 {
		return fmt.Errorf("UserService.GetByEmail: %w", errs.ErrInvalidInput)
	}

	err := U.repository.Delete(ctx, strconv.Itoa(userId))
	if err != nil {
		return fmt.Errorf("UserService.Delete: %w", err)
	}

	return nil
}

// Helper function to map repository User to UserDTO
func mapUserDBToDTO(user entity.UserDB) *entity.UserDTO {
	return &entity.UserDTO{
		Id:         user.Id,
		Email:      user.Email,
		Password:   user.PasswordHash,
		IsVerified: user.IsVerified,
		CreatedAt:  user.CreatedAt,
		UpdatedAt:  user.UpdatedAt,
	}
}

func NewUser(repository *repository.User) User {
	return User{
		repository: repository,
	}
}
