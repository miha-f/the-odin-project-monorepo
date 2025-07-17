package service

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/jwtauth/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
)

type AuthService struct {
	tokenAuth   *jwtauth.JWTAuth
	db          *db.Queries
	userService *UserService
}

func NewAuthService(db *db.Queries, secret []byte, userService *UserService) *AuthService {
	return &AuthService{
		tokenAuth:   jwtauth.New("HS256", secret, nil),
		db:          db,
		userService: userService,
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
			return nil, apperr.NewNotFoundError("username", username)
		}

		return nil, apperr.NewInternalServerError()
	}

	// NOTE(miha): Check if passwords match.
	err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(password))
	if err != nil {
		return nil, apperr.NewBadRequestError()
	}

	return &model.UserResponse{
		UserBase: model.UserBase{
			ID:       int(user.ID),
			Username: user.Username,
		},
	}, nil
}

func (svc AuthService) GenerateJWT(user *model.UserResponse) (string, error) {
	_, tokenString, err := svc.tokenAuth.Encode(map[string]interface{}{
		"userID":   user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(10 * 24 * time.Hour), // TODO: what is sensible exp value?
	})
	if err != nil {
		return "", apperr.NewInternalServerError()
	}

	return tokenString, nil
}

func (svc AuthService) GetUserIDFromToken(tokenStr string) (int64, error) {
	token, err := svc.tokenAuth.Decode(tokenStr)
	if err != nil {
		return 0, err
	}

	ctx := context.Background()
	ctx = jwtauth.NewContext(ctx, token, nil)

	_, claims, err := jwtauth.FromContext(ctx)
	if err != nil {
		return -1, apperr.NewBadRequestError()
	}

	userID, ok := claims["userID"].(float64)
	if !ok {
		return -1, apperr.NewNotFoundError("userID", int64(userID))
	}

	return int64(userID), nil
}

func (svc AuthService) GetUserFromRequest(r *http.Request) (model.User, error) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	usernameAny := claims["username"]

	username, ok := usernameAny.(string)
	if !ok {
		return model.User{}, apperr.NewBadRequestError()
	}

	user, err := svc.userService.GetByUsername(username)
	if err != nil {
		return model.User{}, err
	}

	return user, nil
}
