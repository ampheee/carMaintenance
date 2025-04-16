package errs

import "errors"

var (
	ErrInvalidInput  = errors.New("invalid data input")
	ErrConflict      = errors.New("already exists")
	ErrNotVerified   = errors.New("not Verified")
	ErrNotFound      = errors.New("not found")
	ErrAlreadyExists = errors.New("already exists")
	ErrUnauthorized  = errors.New("unauthorized access")
)
