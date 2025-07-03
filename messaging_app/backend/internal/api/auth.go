package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/jwtauth/v5"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/model"
	"miha-f.github.com/message-app/internal/service"
)

type authApi struct {
	authService *service.AuthService
	userService *service.UserService
	validator   *validator.Validate
}

func NewAuthApi(authService *service.AuthService, userService *service.UserService) *authApi {
	return &authApi{
		authService: authService,
		userService: userService,
		validator:   validator.New(),
	}
}

func (api authApi) HandlePostRegister(w http.ResponseWriter, r *http.Request) {
	type registerRequest struct {
		Username       string `json:"username" validate:"required,min=3"`
		Password       string `json:"password" validate:"required,min=3"`
		PasswordRepeat string `json:"passwordRepeat" validate:"required,eqfield=Password"`
	}
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("invalid JSON body error: %w", err).Error(),
		})
		return
	}

	// TODO(miha): Validate stuff better - better return errors
	if err := api.validator.Struct(req); err != nil {
		w.WriteHeader(http.StatusBadRequest)

		validationErrors := err.(validator.ValidationErrors)
		errorsMap := make(map[string]string)
		for _, fieldErr := range validationErrors {
			errorsMap[fieldErr.Field()] = fmt.Sprintf("failed on the '%s' tag", fieldErr.Tag())
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"errors": errorsMap,
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("unknown auth service error: %w", err).Error(),
		})
		return
	}

	user, err := api.userService.Create(req.Username, string(hashedPassword))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("unknown auth service error: %w", err).Error(),
		})
		return
	}

	tokenString, err := api.authService.GenerateJWT(&model.UserResponse{
		UserBase: model.UserBase{
			Id:       int(user.ID),
			Username: user.Username,
		},
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("unknown auth service error: %w", err).Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"token": tokenString,
		"user":  user,
	})
}

func (api authApi) HandlePostLogin(w http.ResponseWriter, r *http.Request) {
	type loginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var req loginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("invalid JSON body error: %w", err).Error(),
		})
		return
	}

	user, err := api.authService.Authenticate(req.Username, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, apperr.ErrNotFound):
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{
				"error": fmt.Errorf("username not found: %w", err).Error(),
			})
			return
		case errors.Is(err, apperr.ErrBadRequest):
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{
				"error": fmt.Errorf("wrong password: %w", err).Error(),
			})
			return
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{
				"error": fmt.Errorf("unknown auth service error: %w", err).Error(),
			})
			return
		}
	}

	tokenString, err := api.authService.GenerateJWT(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("unknown auth service error: %w", err).Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func (api authApi) HandleGetMe(w http.ResponseWriter, r *http.Request) {
	// TODO(miha): Currently we save Id and username to the jwt token - for
	// conveience. We only have GetUserByUsername and not GetUserById.
	// If we impl GetUserById mayber remove username from token
	_, claims, _ := jwtauth.FromContext(r.Context())
	usernameAny := claims["username"]

	username, ok := usernameAny.(string)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("auth service converting token to string error").Error(),
		})
		return
	}

	user, err := api.userService.GetByUsername(username)
	if err != nil {
		switch {
		case errors.Is(err, apperr.ErrNotFound):
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{
				"error": fmt.Errorf("username not found: %w", err).Error(),
			})
			return
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{
				"error": fmt.Errorf("unknown auth service error: %w", err).Error(),
			})
			return
		}
	}

	json.NewEncoder(w).Encode(user)
}
