package api

import (
	"encoding/json"
	"net/http"

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
	if err := validateRequest(r, &req, api.validator); err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	user, err := api.userService.Create(req.Username, string(hashedPassword))
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	tokenString, err := api.authService.GenerateJWT(&model.UserResponse{
		UserBase: model.UserBase{
			ID:       int(user.ID),
			Username: user.Username,
		},
	})
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
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
		apperr.WriteJSONError(w, err)
		return
	}

	user, err := api.authService.Authenticate(req.Username, req.Password)
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	tokenString, err := api.authService.GenerateJWT(user)
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]string{
		"token": tokenString,
	})
}

func (api authApi) HandleGetMe(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)
	WriteJSON(w, user)
}
