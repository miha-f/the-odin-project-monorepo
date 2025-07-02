package service

import (
	"context"

	"miha-f.github.com/message-app/internal/db/queries"
)

type UserService struct {
	db *queries.Queries
}

func NewUserService(db *queries.Queries) *UserService {
	return &UserService{db: db}
}

func (svc UserService) Create(username, hashedPassword string) (queries.CreateUserRow, error) {
	return svc.db.CreateUser(context.TODO(), queries.CreateUserParams{
		Username:       username,
		HashedPassword: hashedPassword,
	})

	// TODO(miha): Handle duplicate username error
}
