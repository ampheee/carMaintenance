package handler

import (
	"carMaintenance/internal/service"
	"carMaintenance/pkg/config"
)

type Handler struct {
	User service.User
	// Vechile service.Vechile
	// Booking service.Booking
	// Payment service.Payment
	Config config.Config
}

func Init(U service.User, config config.Config) *Handler {
	return &Handler{
		User:   U,
		Config: config,
	}
}
