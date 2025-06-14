package handler

import (
	"carMaintenance/internal/entity"
	"carMaintenance/internal/errs"
	"carMaintenance/internal/middleware"
	"errors"
	"fmt"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

func (h *Handler) SignupHandler(c *fiber.Ctx) error {
	var userDTO entity.UserDTO

	err := c.BodyParser(&userDTO)
	if err != nil {
		err = fmt.Errorf("signup: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(err)
	}

	_, err = h.User.Create(c.UserContext(), userDTO)
	if err != nil {
		err = fmt.Errorf("signup: %w", err)
		slog.Error(err.Error())

		if errors.Is(err, errs.ErrAlreadyExists) {
			err = h.User.Update(c.UserContext(), userDTO.Id, userDTO)
			if err != nil {
				err = fmt.Errorf("signup: %w", err)
				slog.Error(err.Error())
				return c.Status(fiber.StatusInternalServerError).JSON(err)
			}
		} else if !errors.Is(err, errs.ErrNotFound) {
			return c.Status(fiber.StatusInternalServerError).JSON(err)
		}
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) UserInfoHandler(c *fiber.Ctx) error {
	authSession := c.Cookies("session")
	if authSession == "" {
		err := fmt.Errorf("UserInfo: %w", fmt.Errorf("user session is not found"))
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	rawJwtSession, isValid, err := middleware.VerifyJWT(h.Config.JWTSecretKey, authSession)
	if err != nil {
		err = fmt.Errorf("UserInfo: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	if !isValid {
		err = fmt.Errorf("UserInfo: %w", fmt.Errorf("session is not valid"))
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	userId, err := middleware.GetUserIDFromSession(rawJwtSession)
	if err != nil {
		err = fmt.Errorf("UserInfo: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	user, err := h.User.GetById(c.UserContext(), userId)
	if err != nil {
		err = fmt.Errorf("UserInfo: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func (h *Handler) SigninHandler(c *fiber.Ctx) error {
	var user entity.UserDTO

	err := c.BodyParser(&user)
	if err != nil {
		err = fmt.Errorf("signin: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(err)
	}

	userAuth, err := h.User.Authenticate(c.UserContext(), user.Email, user.Password)
	if err != nil {
		err = fmt.Errorf("signin: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	session, _, err := middleware.GenerateJWT(h.Config, userAuth.Id)
	if err != nil {
		err = fmt.Errorf("signin: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	middleware.SetAuthCookie(c, h.Config, session)

	return c.SendStatus(fiber.StatusOK)
}
