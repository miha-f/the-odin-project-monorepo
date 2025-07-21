package api

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
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

func (api authApi) getLogger(r *http.Request) zerolog.Logger {
	return zerolog.Ctx(r.Context()).With().Str("handler", "Auth").Logger()
}

func (api authApi) HandlePostRegister(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type registerRequest struct {
		Username       string `json:"username" validate:"required,min=3"`
		Password       string `json:"password" validate:"required,min=3"`
		PasswordRepeat string `json:"passwordRepeat" validate:"required,eqfield=Password"`
	}
	var req registerRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("body.Username: %+v", req.Username)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Warn().Msgf("hashing password error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	user, err := api.userService.Create(req.Username, string(hashedPassword))
	if err != nil {
		log.Warn().Msgf("creating user error: %v", err)
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
		log.Warn().Msgf("generating token error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msg("succefully registered new user")

	WriteJSON(w, map[string]any{
		"token": tokenString,
		"user":  user,
	})
}

func (api authApi) HandlePostLogin(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type loginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var req loginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Warn().Msgf("decoding error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	user, err := api.authService.Authenticate(req.Username, req.Password)
	if err != nil {
		log.Warn().Msgf("couldn't auth user, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	tokenString, err := api.authService.GenerateJWT(user)
	if err != nil {
		log.Warn().Msgf("couldn't generate token, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msg("succesfully logged in user")

	WriteJSON(w, map[string]string{
		"token": tokenString,
	})
}

func (api authApi) HandleGetMe(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)
	WriteJSON(w, user)
}
