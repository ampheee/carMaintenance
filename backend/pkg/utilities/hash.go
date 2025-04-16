package utilities

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/exp/rand"
)

func HashPassword(password string) ([]byte, error) {
	bytesHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return bytesHash, nil
}

func GenerateVerifyHash(secret, email string, userID int) string {
	message := fmt.Sprintf("%d:%s", userID, email)

	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(message))
	hash := h.Sum(nil)

	return base64.URLEncoding.EncodeToString(hash)
}

func ValidateVerifyHash(secret, email string, userID int, receivedHash string) bool {
	expectedHash := GenerateVerifyHash(secret, email, userID)

	return hmac.Equal([]byte(receivedHash), []byte(expectedHash))
}

const lowerNum = 100000
const upperNum = 1000000

func GenerateID() int {
	r := rand.New(rand.NewSource(uint64(time.Now().UnixNano())))
	randomNum := r.Intn(upperNum-lowerNum) + lowerNum
	return randomNum
}
