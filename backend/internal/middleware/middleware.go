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

var (
	ErrInvalidSession    = errors.New("invalid or expired session")
	ErrUnexpectedSigning = errors.New("unexpected signing method")
	ErrWebSocketUpgrade  = errors.New("websocket upgrade required")
)

type Middleware struct {
	Config config.Config
}

func GenerateJWT(conf config.Config, userId int) (string, string, error) {
	expiresIn := time.Now().UTC().Add(time.Duration(conf.JWTMaxAge) * time.Minute)
	claims := jwt.MapClaims{
		claimExpiresAt: expiresIn,
		claimUserId:    userId,
	}
	authSession := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	sessionString, err := authSession.SignedString([]byte(conf.JWTSecretKey))
	if err != nil {
		return "", "", fmt.Errorf("failed to sign JWT: %w", err)
	}
	return sessionString, expiresIn.String(), nil
}

func GetUserIDFromSession(authSession *jwt.Token) (int, error) {
	claims, ok := authSession.Claims.(jwt.MapClaims)
	if !ok {
		return 0, fmt.Errorf("failed to parse session claims")
	}

	userId, exists := claims[claimUserId]
	if !exists {
		return 0, fmt.Errorf("missing '%s' claim in session", claimUserId)
	}

	userIdInt := int(userId.(float64))

	return userIdInt, nil
}

func VerifyJWT(secretKey, sessionStr string) (*jwt.Token, bool, error) {
	session, err := jwt.Parse(sessionStr, func(session *jwt.Token) (interface{}, error) {
		if _, ok := session.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrUnexpectedSigning
		}
		return []byte(secretKey), nil
	})

	if err != nil || !session.Valid {
		slog.Warn("Invalid or expired JWT session", "error", err)
		return nil, false, fmt.Errorf("invalid or expired session")
	}

	return session, true, nil
}

func (m *Middleware) AuthMiddleware() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		authsession := c.Cookies("session")
		if authsession == "" {
			return c.Redirect("/signin", fiber.StatusTemporaryRedirect)
		}

		rawJwtsession, isValid, err := VerifyJWT(m.Config.JWTSecretKey, authsession)
		if err != nil || !isValid {
			slog.Warn("Invalid or missing auth session")
			return c.Redirect("/signin", fiber.StatusTemporaryRedirect)
		}

		userID, err := GetUserIDFromSession(rawJwtsession)
		if err != nil {
			slog.Warn("Failed to extract user ID from session")
			return c.Redirect("/signin", fiber.StatusTemporaryRedirect)
		}

		c.Locals("userID", userID)

		return c.Next()
	}
}

func SetAuthCookie(c *fiber.Ctx, conf config.Config, session string) error {
	cookieInspirationTime := time.Now().UTC()
	sessionCookie := &fiber.Cookie{
		Name:     "session",
		Value:    session,
		Path:     "/",
		Domain:   conf.ServerHost,
		MaxAge:   conf.JWTMaxAge * 60,
		Expires:  cookieInspirationTime,
		Secure:   false,
		HTTPOnly: false,
		SameSite: "Lax",
	}

	c.Cookie(sessionCookie)
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
