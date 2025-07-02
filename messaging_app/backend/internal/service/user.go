package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db/queries"
	"miha-f.github.com/message-app/internal/model"
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

func (svc UserService) GetByUsername(username string) (*model.UserResponse, error) {
	user, err := svc.db.GetUserByUsername(context.TODO(), username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w: user %s not found: %w", apperr.ErrNotFound, username, err)
		}

		return nil, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	return &model.UserResponse{
		UserBase: model.UserBase{
			Id:       int(user.ID),
			Username: user.Username,
		},
	}, nil
}
