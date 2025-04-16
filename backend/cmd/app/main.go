package main

import (
	"carMaintenance/internal/app"
	"carMaintenance/internal/handler"
	"carMaintenance/internal/repository"
	"carMaintenance/internal/service"
	"carMaintenance/pkg/config"
	"carMaintenance/pkg/logger"
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v3/log"
)

func main() {
	newLogger := logger.NewLogger()
	slog.SetDefault(newLogger)

	conf := config.New()
	app := app.New(conf)

	userRepository := repository.NewUser(conf)

	userService := service.NewUser(userRepository)

	handler := handler.Init(userService, conf)

	app.Handle(handler)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		if err := app.App.Listen(conf.ServerPort); err != nil {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	<-ctx.Done()
	slog.Info("Shutting down REST server...")
	app.App.Shutdown()
	slog.Info("REST server stopped gracefully")
}
