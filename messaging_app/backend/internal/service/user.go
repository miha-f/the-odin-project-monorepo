package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
)

type UserService struct {
	db *db.Queries
}

func NewUserService(db *db.Queries) *UserService {
	return &UserService{db: db}
}

func (svc UserService) Create(username, hashedPassword string) (db.CreateUserRow, error) {
	return svc.db.CreateUser(context.TODO(), db.CreateUserParams{
		Username:       username,
		HashedPassword: hashedPassword,
	})

	// TODO(miha): Handle duplicate username error
}

func (svc UserService) GetByUsername(username string) (model.User, error) {
	user, err := svc.db.GetUserByUsername(context.TODO(), username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, fmt.Errorf("%w: user %s not found: %w", apperr.ErrNotFound, username, err)
		}

		return model.User{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	return model.User{
		ID:        int64(user.ID),
		Username:  user.Username,
		CreatedAt: user.CreatedAt.Time,
	}, nil
}
