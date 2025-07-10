package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/appmiddleware"
	"miha-f.github.com/message-app/internal/model"
)

func getUserFromContext(r *http.Request) model.User {
	return r.Context().Value(appmiddleware.ContextUserKey).(model.User)
}

func getRoomIdFromPath(r *http.Request) (int64, error) {
	roomIDStr := chi.URLParam(r, "roomId")
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil {
		// TODO: customError
		return -1, fmt.Errorf("Invalid user ID: %w", err)
	}
	return roomID, nil
}

func isUserInRoom(r *http.Request) bool {
	return r.Context().Value(appmiddleware.ContextIsUserInRoomKey).(bool)
}

func validateRequest(r *http.Request, obj any, v *validator.Validate) error {
	if err := json.NewDecoder(r.Body).Decode(obj); err != nil {
		return fmt.Errorf("invalid JSON body: %w", err)
	}

	if err := v.Struct(obj); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			verr := &apperr.ValidationError{}
			for _, fieldErr := range validationErrors {
				verr.Append(fieldErr)
			}
			return verr
		}
		return err
	}

	return nil
}
