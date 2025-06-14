package handler

import (
	"carMaintenance/internal/service"
	"carMaintenance/pkg/config"
)

type Handler struct {
	User    service.User
	Booking service.Booking
	Order   service.Order

	Config config.Config
}

func Init(U service.User, config config.Config) *Handler {
	return &Handler{
		User:   U,
		Config: config,
	}
}
