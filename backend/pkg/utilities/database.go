package utilities

import (
	"carMaintenance/pkg/config"
	"database/sql"
	"fmt"
	"log/slog"
	"time"

	_ "github.com/lib/pq"
)

func ConnectPostgres(c config.Config) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.PostgresServerName,
		c.PostgresPort,
		c.PostgresUser,
		c.PostgresPassword,
		c.PostgresDBName,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		slog.Error("Failed to open PostgreSQL connection", "error", err)
		return nil, err
	}

	// Set connection pool settings
	db.SetMaxOpenConns(c.ServerMaxConns)
	db.SetMaxIdleConns(c.ServerMaxConns / 2)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	if err := db.Ping(); err != nil {
		slog.Error("Failed to ping PostgreSQL", "error", err)
		return nil, err
	}

	slog.Info("Successfully connected to PostgreSQL")
	return db, nil
}
