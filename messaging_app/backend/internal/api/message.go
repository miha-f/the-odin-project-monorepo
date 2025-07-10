package api

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
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

func (api messageApi) HandleGetLatestMessages(w http.ResponseWriter, r *http.Request) {
	isUserInRoom := isUserInRoom(r)
	if !isUserInRoom {
	}

	roomID, err := getRoomIdFromPath(r)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	messages, err := api.messageService.GetLatestMessages(int64(roomID), 100, 0)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"room_id":  roomID,
		"messages": messages,
	})
}

func (api messageApi) HandleGetUndreadMessageCount(w http.ResponseWriter, r *http.Request) {
	roomID, err := getRoomIdFromPath(r)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	user := getUserFromContext(r)

	count, err := api.messageService.GetUnreadMessageCount(int64(roomID), user.ID)
	if err != nil {
	}

	json.NewEncoder(w).Encode(map[string]any{
		"unread_count": count,
	})
}

// TODO: sqlc impl
func (api messageApi) HandleGetRoomsWithUndreadMessages(w http.ResponseWriter, r *http.Request) {
	panic("not impl")
	// return:
	// {
	//   unread_messages: map[roomId]bool
	// }
}

func (api messageApi) HandlePostCreateMessage(w http.ResponseWriter, r *http.Request) {
	type createMessageRequest struct {
		Content string `json:"content" validate:"required,min=1"`
	}
	var req createMessageRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		// TODO: return err
	}

	roomID, err := getRoomIdFromPath(r)
	if err != nil {
		// TODO: customError
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	user := getUserFromContext(r)

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
