package handler

import (
	"carMaintenance/internal/entity"
	"carMaintenance/internal/errs"
	"carMaintenance/internal/middleware"
	"carMaintenance/pkg/utilities"
	"errors"
	"fmt"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

// SignupHandler handles user registration.
func (h *Handler) SignupHandler(c *fiber.Ctx) error {
	var userDTO entity.UserDTO

	err := c.BodyParser(&userDTO)
	if err != nil {
		err = fmt.Errorf("signup: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(err)
	}

	userId, err := h.User.Create(c.UserContext(), userDTO)
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

	verifyHash := utilities.GenerateVerifyHash(h.Config.HashSecretKey, userDTO.Email, userId)
	if verifyHash == "" {
		err = fmt.Errorf("signup: %w", fmt.Errorf("failed to generate hash"))
		slog.Error(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	verifyLink := fmt.Sprintf(
		"%s%s/signup/verify/%s",
		h.Config.ServerScheme,
		h.Config.ServerHost,
		verifyHash,
	)

	err = utilities.SendVerificationEmail(
		h.Config.MailFromName,
		h.Config.MailFromAddress,
		userDTO.Email,
		h.Config.MailServerName,
		h.Config.MailPort,
		h.Config.MailPassword,
		verifyLink,
	)

	if err != nil {
		err = fmt.Errorf("signup: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) VerifyHandler(c *fiber.Ctx) error {
	receivedHash := c.Params("hash")
	if receivedHash == "" {
		err := fmt.Errorf("verify: %w", errs.ErrInvalidInput)
		slog.Error(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(err)
	}

	err := h.User.Verify(c.UserContext(), h.Config.HashSecretKey, receivedHash)
	if err != nil {
		err = fmt.Errorf("verify: %w", err)
		slog.Error(err.Error())
		if errors.Is(err, errs.ErrNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(err)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) UserInfoHandler(c *fiber.Ctx) error {
	authToken := c.Cookies("token")
	if authToken == "" {
		err := fmt.Errorf("UserInfo: %w", fmt.Errorf("user token is not found"))
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	rawJwtToken, isValid, err := middleware.VerifyJWT(h.Config.JWTSecretKey, authToken)
	if err != nil {
		err = fmt.Errorf("UserInfo: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	if !isValid {
		err = fmt.Errorf("UserInfo: %w", fmt.Errorf("token is not valid"))
		slog.Error(err.Error())
		return c.Status(fiber.StatusForbidden).JSON(err)
	}

	userId, err := middleware.GetUserIDFromToken(rawJwtToken)
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

	token, _, err := middleware.GenerateJWT(h.Config, userAuth.Id)
	if err != nil {
		err = fmt.Errorf("signin: %w", err)
		slog.Error(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	middleware.SetAuthCookie(c, h.Config, token)

	return c.SendStatus(fiber.StatusOK)
}
