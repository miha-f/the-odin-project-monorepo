package model

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
