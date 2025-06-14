package logger

import (
	"log/slog"
	"os"
)

func newSlogHandler() slog.Handler {
	options := slog.HandlerOptions{}
	handler := slog.NewJSONHandler(
		os.Stdout,
		&options,
	)

	return handler
}

func NewLogger() *slog.Logger {
	handler := newSlogHandler()
	return slog.New(handler)
}
