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
	FrontendPath = "../frontend/build"
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

func (a *App) InitMiddlewares() {
	// CORS middleware
	// a.App.Use(cors.New(cors.Config{
	// 	AllowOrigins:     a.Config.ServerHost,
	// 	AllowHeaders:     "Origin, Content-Type, Accept",
	// 	AllowCredentials: true,
	// }))
}

func (a *App) Handle(h *handler.Handler) {
	a.InitMiddlewares()

	_, err := os.Stat(FrontendPath)
	if err != nil {
		log.Fatal(err)
	}

	a.App.Static("/", FrontendPath)

	api := a.App.Group("/api/v1")
	// auth
	api.Post("/signup", h.SignupHandler)
	api.Patch("/signup/verify/:hash", h.VerifyHandler)
	api.Post("/signin", h.SigninHandler)

	// user
	api.Get("/user", h.GetUserHandler)
	api.Patch("/user", h.UpdateUserHandler)
	api.Delete("/user", h.DeleteUserHandler)
	// calendar

	// garage
	api.Get("/garage", h.GetGarageHandler)
	api.Post("/garage", h.CreateGarageHandler)
	api.Patch("/garage", h.UpdateGarageHandler)
	api.Delete("/garage", h.DeleteGarageHandler)

	// payment
	api.Get("/user/booking", h.GetBookingHandler)
	api.Post("/user/booking", h.CreateBookingHandler)
	api.Patch("/user/booking", h.UpdateBookingHandler)
	api.Delete("/user/booking", h.DeleteBookingHandler)

	// maintenance

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
