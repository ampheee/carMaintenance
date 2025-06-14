package app

import (
	"carMaintenance/internal/handler"
	"carMaintenance/pkg/config"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

const (
	FrontendPath = "./frontend/build"
)

type App struct {
	Config config.Config
	App    *fiber.App
}

func New(
	Config config.Config,
) *App {
	newApp := fiber.New(fiber.Config{
		ServerHeader: Config.ServerName,
		Concurrency:  Config.ServerMaxConns,
		AppName:      Config.AppName,
	})

	return &App{
		App:    newApp,
		Config: Config,
	}
}

func (a *App) Handle(h *handler.Handler) {
	_, err := os.Stat(FrontendPath)
	if err != nil {
		log.Fatal(err)
	}

	a.App.Static("/", FrontendPath)

	api := a.App.Group("/api/v1")
	// auth
	api.Post("/signup", h.SignupHandler)
	api.Post("/signin", h.SigninHandler)

	// user
	api.Get("/user", h.GetUserHandler)
	api.Patch("/user", h.UpdateUserHandler)
	api.Delete("/user", h.DeleteUserHandler)

	// booking
	api.Get("/booking", h.GetBookingHandler)
	api.Post("/booking", h.CreateBookingHandler)
	api.Patch("/booking", h.UpdateBookingHandler)
	api.Delete("/booking", h.DeleteBookingHandler)

	// order
	api.Get("/order", h.GetOrderHandler)
	api.Post("/order", h.CreateOrderHandler)
	api.Patch("/order", h.UpdateOrderHandler)
	api.Delete("/order", h.DeleteOrderHandler)

	// service
	api.Get("/service", h.GetServiceHandler)
	api.Post("/service", h.CreateServiceHandler)
	api.Patch("/service", h.UpdateServiceHandler)
	api.Delete("/service", h.DeleteServiceHandler)

	// products
	api.Get("/product", h.GetProductHandler)
	api.Post("/product", h.CreateProductHandler)
	api.Patch("/product", h.UpdateProductHandler)
	api.Delete("/product", h.DeleteProductHandler)

	a.App.Use(func(c *fiber.Ctx) error {
		filePath := fmt.Sprintf("%s%s", FrontendPath, c.OriginalURL())
		if _, err := os.Stat(filePath); err == nil {
			return c.SendFile(filePath)
		}

		return c.SendFile(fmt.Sprintf("%s/index.html", FrontendPath))
	})
}

func (a *App) Run() error {
	return a.App.Listen(a.Config.ServerPort)
}
