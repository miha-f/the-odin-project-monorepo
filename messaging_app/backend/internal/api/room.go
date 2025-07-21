package api

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
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

func (api roomApi) getLogger(r *http.Request) zerolog.Logger {
	return zerolog.Ctx(r.Context()).With().Str("handler", "Room").Logger()
}

func (api roomApi) HandleGetUserRooms(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)
	user := getUserFromContext(r)

	rooms, err := api.roomService.GetUserRooms(user.ID, 100, 0)
	if err != nil {
		log.Warn().Msgf("couldn't get user (%v) rooms, error: %v", user, err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("got user (%v) rooms: %v", user, rooms)

	WriteJSON(w, map[string]any{
		"rooms": rooms,
	})
}

func (api roomApi) HandleGetAllUsersInRoom(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	roomID, err := getRoomIDFromPath(r)
	if err != nil {
		log.Warn().Msgf("invalid path roomID: %d, error: %v", roomID, err)
		apperr.WriteJSONError(w, apperr.NewInvalidPathParamError("roomID", fmt.Sprintf("%d", roomID)))
		return
	}

	roomMembers, err := api.roomService.GetAllUsersInRoom(int64(roomID))
	if err != nil {
		log.Warn().Msgf("couldn't get room members, error:", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("roomID: %d, room members: %+v", roomID, roomMembers)

	WriteJSON(w, map[string]any{
		"room_members": roomMembers,
	})
}

func (api roomApi) HandlePostCreateRoom(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type createRoomRequest struct {
		Name      string `json:"name" validate:"required,min=3"`
		IsPrivate bool   `json:"is_private"`
	}
	var req createRoomRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("body: %+v", req)

	user := getUserFromContext(r)

	room, err := api.roomService.CreateRoom(req.Name, req.IsPrivate, user.ID)
	if err != nil {
		log.Warn().Msgf("error creating room: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("created room: %+v", room)

	WriteJSON(w, map[string]any{
		"room": room,
	})
}

func (api roomApi) HandlePostAddUser(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type addUserRequest struct {
		NewUserID int `json:"new_user_id" validate:"required,gt=0"`
		RoomID    int `json:"room_id" validate:"required,gt=0"`
	}
	var req addUserRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("body: %+v", req)

	user := getUserFromContext(r)

	err := api.roomService.AddRoomMember(user.ID, int64(req.NewUserID), int64(req.RoomID))
	if err != nil {
		log.Warn().Msgf("error creating adding user: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("added new user: %d into room: %d", req.NewUserID, req.RoomID)

	WriteJSON(w, map[string]any{
		"new_user": req,
	})
}

func (api roomApi) HandleDeleteUser(w http.ResponseWriter, r *http.Request) {
}
