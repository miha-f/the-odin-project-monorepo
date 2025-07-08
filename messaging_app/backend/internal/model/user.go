package model

import "time"

type UserBase struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	// CreatedAt time.Time `json:"createdAt"`
}

type UserResponse struct {
	UserBase
}

type UserWithHashedPassword struct {
	UserBase
	HashedPassword string `json:"-"`
}

type User struct {
	ID             int64     `json:"id"`
	Username       string    `json:"username"`
	HashedPassword string    `json:"-"`
	CreatedAt      time.Time `json:"created_at"`
}
