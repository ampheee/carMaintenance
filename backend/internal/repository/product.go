package repository

import "database/sql"

type Product struct {
	db *sql.DB
}
