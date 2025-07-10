package api

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
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
	user := getUserFromContext(r)

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
	isUserInRoom := isUserInRoom(r)
	roomID, err := getRoomIdFromPath(r)
	if err != nil {
	}

	// TODO: check if room is public also -> we need to be in room anyway. If room is
	// public we are free to join in the room and then check stuff in room
	// TODO: return unathorized err
	if !isUserInRoom {
	}

	roomMembers, err := api.roomService.GetAllUsersInRoom(int64(roomID))
	if err != nil {
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
	if err := validateRequest(r, &req, api.validator); err != nil {
		// TODO: return err
	}

	user := getUserFromContext(r)

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
