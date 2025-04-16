package middleware

//
//import (
//	"fmt"
//	"github.com/gofiber/fiber/v2"
//	"github.com/gofiber/fiber/v2/middleware/session"
//	"time"
//)
//
//type SessionsTool struct {
//	sessionStore *session.Store
//}
//
//func InitSessionsTool() *SessionsTool {
//	var s = SessionsTool{}
//	s.sessionStore = session.New(session.Config{
//		Expiration: 30 * time.Minute,
//	})
//	return &s
//}
//
//func (s *SessionsTool) CreateNewSession(c *fiber.Ctx, RoomName string) {
//	currentSession, _ := s.sessionStore.Get(c)
//	currentSession.Set("RoomName", RoomName)
//	err := currentSession.Save()
//	if err != nil {
//		return
//	}
//}
//
//func (s *SessionsTool) CheckAndUpdateSession(c *fiber.Ctx) bool {
//	currentSession, err := s.sessionStore.Get(c)
//	if err != nil {
//		fmt.Println(err)
//	}
//	//untyped := currentSession.Get("UserLogin")
//	err = currentSession.Save()
//	if err != nil {
//		return false
//	}
//	return true
//}
//
//func (s *SessionsTool) GetUserLoginSession(c *fiber.Ctx) string {
//	currentSession, _ := s.sessionStore.Get(c)
//
//	userName := currentSession.Get("UserName")
//	return userName.(string)
//}
