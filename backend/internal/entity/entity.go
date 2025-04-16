package entity

type UserDTO struct {
	Id         int    `json:"id"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Role       string `json:"role"`
	IsVerified bool   `json:"is_verified"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

type UserDB struct {
	Id           int
	Email        string
	PasswordHash string
	Role         string
	IsVerified   bool
	CreatedAt    string
	UpdatedAt    string
}
