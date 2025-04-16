package middleware

import (
	"carMaintenance/pkg/config"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/gofiber/contrib/websocket"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

const (
	claimUserId    = "user_id"
	claimExpiresAt = "expires_in"
)

// Custom Errors
var (
	ErrInvalidToken      = errors.New("invalid or expired token")
	ErrUnexpectedSigning = errors.New("unexpected signing method")
	ErrWebSocketUpgrade  = errors.New("websocket upgrade required")
)

// Middleware Struct
type Middleware struct {
	Config config.Config
}

// GenerateJWT generates a signed JWT token
func GenerateJWT(conf config.Config, userId int) (string, string, error) {
	expiresIn := time.Now().UTC().Add(time.Duration(conf.JWTMaxAge) * time.Minute)
	claims := jwt.MapClaims{
		claimExpiresAt: expiresIn,
		claimUserId:    userId,
	}
	authToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := authToken.SignedString([]byte(conf.JWTSecretKey))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign JWT: %w", err)
	}
	return tokenString, expiresIn.String(), nil
}

func GetUserIDFromToken(authToken *jwt.Token) (int, error) {
	claims, ok := authToken.Claims.(jwt.MapClaims)
	if !ok {
		return 0, fmt.Errorf("failed to parse token claims")
	}

	userId, exists := claims[claimUserId]
	if !exists {
		return 0, fmt.Errorf("missing '%s' claim in token", claimUserId)
	}

	userIdInt := int(userId.(float64))

	return userIdInt, nil
}

// VerifyJWT verifies the JWT token in the request
func VerifyJWT(secretKey, tokenStr string) (*jwt.Token, bool, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrUnexpectedSigning
		}
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		slog.Warn("Invalid or expired JWT token", "error", err)
		return nil, false, fmt.Errorf("invalid or expired token")
	}

	return token, true, nil
}

// Authentication Middleware
func (m *Middleware) AuthMiddleware() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		authToken := c.Cookies("token")
		if authToken == "" {
			return c.Redirect("/signin", fiber.StatusTemporaryRedirect)
		}

		rawJwtToken, isValid, err := VerifyJWT(m.Config.JWTSecretKey, authToken)
		if err != nil || !isValid {
			slog.Warn("Invalid or missing auth token")
			return c.Redirect("/signin", fiber.StatusTemporaryRedirect)
		}

		userID, err := GetUserIDFromToken(rawJwtToken)
		if err != nil {
			slog.Warn("Failed to extract user ID from token")
			return c.Redirect("/signin", fiber.StatusTemporaryRedirect)
		}

		c.Locals("userID", userID)

		return c.Next()
	}
}

func SetAuthCookie(c *fiber.Ctx, conf config.Config, token string) error {
	cookieInspirationTime := time.Now().UTC()
	tokenCookie := &fiber.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		Domain:   conf.ServerHost,
		MaxAge:   conf.JWTMaxAge * 60,
		Expires:  cookieInspirationTime,
		Secure:   false,
		HTTPOnly: false,
		SameSite: "Lax",
	}

	c.Cookie(tokenCookie)
	return nil
}

// Upgrade ensures the request is a valid WebSocket upgrade
func (m *Middleware) Upgrade(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		c.Locals("allowed", true)
		return c.Next()
	}
	slog.Warn("WebSocket upgrade required")
	return fiber.ErrUpgradeRequired
}

// New creates a new Middleware instance
func New(conf config.Config) *Middleware {
	return &Middleware{
		Config: conf,
	}
}
