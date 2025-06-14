package repository

import "database/sql"

type Order struct {
	db *sql.DB
}
