package appmiddleware

import (
	"context"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"miha-f.github.com/message-app/internal/model"
	"miha-f.github.com/message-app/internal/service"
)

const ContextIsUserInRoomKey ctxKey = "userInRoom"

func CheckUserHasRoomAccess(roomService *service.RoomService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			user := r.Context().Value(ContextUserKey).(model.User)

			roomIDStr := chi.URLParam(r, "roomID")
			roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
			if err != nil {
				// TODO: customError
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			inRoom, err := roomService.IsUserInRoom(user.ID, roomID)
			if err != nil {
				// TODO: customError
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			ctx := context.WithValue(r.Context(), ContextIsUserInRoomKey, inRoom)
			next.ServeHTTP(w, r.WithContext(ctx))
		}

		return http.HandlerFunc(fn)
	}
}
