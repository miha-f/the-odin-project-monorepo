package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/go-chi/jwtauth/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db/queries"
	"miha-f.github.com/message-app/internal/model"
)

type AuthService struct {
	tokenAuth *jwtauth.JWTAuth
	db        *queries.Queries
}

func NewAuthService(db *queries.Queries, secret []byte) *AuthService {
	return &AuthService{
		tokenAuth: jwtauth.New("HS256", secret, nil),
		db:        db,
	}
}

func (svc AuthService) GetTokenAuth() *jwtauth.JWTAuth {
	return svc.tokenAuth
}

func (svc AuthService) Authenticate(username, password string) (*model.UserResponse, error) {
	// TODO(miha): Move this to userService
	// NOTE(miha): Check if user exists.
	user, err := svc.db.GetUserByUsername(context.TODO(), username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w: user %s not found: %w", apperr.ErrNotFound, username, err)
		}

		return nil, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	// NOTE(miha): Check if passwords match.
	err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(password))
	if err != nil {
		return nil, fmt.Errorf("%w: wrong password :%w", apperr.ErrBadRequest, err)
	}

	return &model.UserResponse{
		UserBase: model.UserBase{
			Id:       int(user.ID),
			Username: user.Username,
		},
	}, nil
}

func (svc AuthService) GenerateJWT(user *model.UserResponse) (string, error) {
	_, tokenString, err := svc.tokenAuth.Encode(map[string]interface{}{
		"userId":   user.Id,
		"username": user.Username,
		"exp":      time.Now().Add(24 * time.Hour),
	})
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (svc AuthService) GetUserID(tokenStr string) (int64, error) {
	token, err := svc.tokenAuth.Decode(tokenStr)
	if err != nil {
		return 0, err
	}

	ctx := context.Background()
	ctx = jwtauth.NewContext(ctx, token, nil)

	_, claims, err := jwtauth.FromContext(ctx)
	if err != nil {
		return -1, errors.New("token invalid")
	}

	userID, ok := claims["userId"].(float64)
	if !ok {
		return -1, errors.New("userId not found or wrong type")
	}

	return int64(userID), nil
}
