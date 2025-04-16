package repository

import (
	"carMaintenance/internal/entity"
	"carMaintenance/internal/errs"
	"carMaintenance/pkg/config"
	"carMaintenance/pkg/utilities"
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type User struct {
	db *sql.DB
}

func (r *User) Create(ctx context.Context, user entity.UserDB) (int, error) {
	query := `
			INSERT INTO users (email, password_hash, is_verified, created_at)
			VALUES ($1, $2, $3, $4)
			RETURNING id`

	var userID int
	err := r.db.QueryRowContext(
		ctx,
		query,
		user.Email,
		user.PasswordHash,
		user.IsVerified,
		user.CreatedAt,
	).Scan(&userID)

	if err != nil {
		return 0, fmt.Errorf("UserRepository.Create: %w", err)
	}

	return userID, nil
}

func (r *User) GetByEmail(ctx context.Context, email string) (*entity.UserDB, error) {
	query := `SELECT id, email, password_hash, is_verified, created_at, updated_at FROM users WHERE email = $1`
	var user entity.UserDB
	err := r.db.QueryRowContext(
		ctx,
		query,
		email,
	).Scan(
		&user.Id,
		&user.Email,
		&user.PasswordHash,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("UserRepository.GetByEmail: %w", errs.ErrNotFound)
		}

		return nil, fmt.Errorf("UserRepository.GetByEmail: %w", err)
	}

	return &user, nil
}

func (r *User) GetById(ctx context.Context, id int) (*entity.UserDB, error) {
	query := `SELECT id, email, password_hash, is_verified, created_at, updated_at FROM users WHERE id = $1`
	var user entity.UserDB
	err := r.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&user.Id,
		&user.Email,
		&user.PasswordHash,
		&user.IsVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("UserRepository.GetById: %w", errs.ErrNotFound)
		}

		return nil, fmt.Errorf("UserRepository.GetById: %w", err)
	}

	return &user, nil
}

func (r *User) GetAll(ctx context.Context) ([]entity.UserDB, error) {
	query := `
			SELECT id, email, password_hash, is_verified, created_at, updated_at
			FROM users
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("UserRepository.GetAll: failed to fetch all users: %w", err)
	}

	defer rows.Close()

	var users []entity.UserDB

	for rows.Next() {
		var user entity.UserDB
		err := rows.Scan(
			&user.Id,
			&user.Email,
			&user.PasswordHash,
			&user.IsVerified,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("UserResository.GetAll: %w", err)
		}

		users = append(users, user)
	}

	err = rows.Err()
	if err != nil {
		return nil, fmt.Errorf("UserResository.GetAll: %w", err)
	}

	return users, nil
}

func (r *User) Update(ctx context.Context, user entity.UserDB) error {
	query := `
	UPDATE users
	SET email = $1, password_hash = $2, is_verified = $3, updated_at = $4
	WHERE id = $5`

	result, err := r.db.ExecContext(
		ctx,
		query,
		user.Email,
		user.PasswordHash,
		user.IsVerified,
		user.UpdatedAt,
		user.Id,
	)
	if err != nil {
		return fmt.Errorf("UserResository.Update: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("UserRepository.Update %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("UserRepository.Update: %w", errs.ErrNotFound)
	}

	return nil
}

func (r *User) Delete(ctx context.Context, userID string) error {
	query := `DELETE FROM users WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("UserRepository.Delete %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("UserRepository.Delete: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("UserRepository.Delete: %w", errs.ErrNotFound)
	}

	return nil
}

// NewUserRepository initializes a new in-memory repository.
func NewUser(config config.Config) *User {
	connection, err := utilities.ConnectPostgres(config)
	if err != nil {
		log.Fatal(err)
	}

	return &User{connection}
}
