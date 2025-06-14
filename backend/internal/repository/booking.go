package repository

import "database/sql"

type Booking struct {
	db *sql.DB
}
