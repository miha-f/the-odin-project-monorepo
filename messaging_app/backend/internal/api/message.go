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

type messageApi struct {
	authService    *service.AuthService
	roomService    *service.RoomService
	messageService *service.MessageService
	validator      *validator.Validate
}

func NewMessageApi(
	authService *service.AuthService,
	roomService *service.RoomService,
	messageService *service.MessageService,
) *messageApi {
	return &messageApi{
		authService:    authService,
		roomService:    roomService,
		messageService: messageService,
		validator:      validator.New(),
	}
}

// HandleGetLatestMessages
func (api messageApi) HandleGetLatestMessages(w http.ResponseWriter, r *http.Request) {
	roomIDStr := chi.URLParam(r, "roomId")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
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

	inRoom, err := api.roomService.IsUserInRoom(user.ID, int64(roomID))
	if err != nil {
	}
	if !inRoom {
	}

	messages, err := api.messageService.GetLatestMessages(int64(roomID), 100, 0)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"room_id":  roomID,
		"messages": messages,
	})
}

// HandleGetUndreadMessageCount
func (api messageApi) HandleGetUndreadMessageCount(w http.ResponseWriter, r *http.Request) {
	roomIDStr := chi.URLParam(r, "roomId")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
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

	count, err := api.messageService.GetUnreadMessageCount(int64(roomID), user.ID)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"unread_count": count,
	})
}

// TODO: sqlc impl
func (api messageApi) HandleGetRoomsWithUndreadMessages(w http.ResponseWriter, r *http.Request) {
	// return:
	// {
	//   unread_messages: map[roomId]bool
	// }
}

// HandlePostCreateMessage
func (api messageApi) HandlePostCreateMessage(w http.ResponseWriter, r *http.Request) {
	type createMessageRequest struct {
		// UserId int `json:"user_id" validate:"required"`
		// RoomId  int    `json:"room_id" validate:"required"`
		Content string `json:"content" validate:"required,min=1"`
	}
	var req createMessageRequest
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

	roomIDStr := chi.URLParam(r, "roomId")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
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

	message, err := api.messageService.CreateMessage(
		int64(roomID),
		int64(user.ID),
		req.Content,
	)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"message": message,
	})
}
