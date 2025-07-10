package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/service"
)

type roomApi struct {
	authService *service.AuthService
	roomService *service.RoomService
	validator   *validator.Validate
}

func NewRoomApi(authService *service.AuthService, roomService *service.RoomService) *roomApi {
	return &roomApi{
		authService: authService,
		roomService: roomService,
		validator:   validator.New(),
	}
}

func (api roomApi) HandleGetUserRooms(w http.ResponseWriter, r *http.Request) {
	user, err := api.authService.GetUserFromRequest(r)
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

	rooms, err := api.roomService.GetUserRooms(user.ID, 100, 0)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"rooms": rooms,
	})
}

// TODO(miha): Need to check that logged in user is in the room - we do this, but
// we don't do anything in the if/else.
func (api roomApi) HandleGetAllUsersInRoom(w http.ResponseWriter, r *http.Request) {
	user, err := api.authService.GetUserFromRequest(r)
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

	roomIDStr := chi.URLParam(r, "roomId")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	roomMembers, err := api.roomService.GetAllUsersInRoom(int64(roomID))
	if err != nil {
	}

	userInRoom := false
	for _, rm := range roomMembers {
		if rm.ID == user.ID {
			userInRoom = true
		}
	}
	// TODO: return unathorized err
	// TODO: check if room is public also
	if !userInRoom {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"room_members": roomMembers,
	})
}

func (api roomApi) HandlePostCreateRoom(w http.ResponseWriter, r *http.Request) {
	type createRoomRequest struct {
		Name      string `json:"name" validate:"required,min=3"`
		IsPrivate bool   `json:"is_private"`
	}
	var req createRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": fmt.Errorf("invalid JSON body error: %w", err).Error(),
		})
		return
	}
	// TODO(miha): Validate stuff better - better return errors. And move to apperrs or smth
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

	user, err := api.authService.GetUserFromRequest(r)
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

	room, err := api.roomService.CreateRoom(req.Name, req.IsPrivate, user.ID)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"room": room,
	})
}

func (api roomApi) HandlePostAddUser(w http.ResponseWriter, r *http.Request) {
}

func (api roomApi) HandleDeleteUser(w http.ResponseWriter, r *http.Request) {
}
