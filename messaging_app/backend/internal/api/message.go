package api

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
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

func (api messageApi) getLogger(r *http.Request) zerolog.Logger {
	return zerolog.Ctx(r.Context()).With().Str("handler", "Message").Logger()
}

func (api messageApi) HandleGetLatestMessages(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	roomID, err := getRoomIDFromPath(r)
	if err != nil {
		log.Warn().Msgf("couldn't get roomID from path, error: %v", err)
		apperr.WriteJSONError(w, apperr.NewInvalidPathParamError("roomID", fmt.Sprintf("%d", roomID)))
		return
	}

	messages, err := api.messageService.GetLatestMessages(int64(roomID), 100, 0)
	if err != nil {
		log.Warn().Msgf("couldn't get latest messages, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("succesfully got room (%d) messages: %v", roomID, messages)

	WriteJSON(w, map[string]any{
		"room_id":  roomID,
		"messages": messages,
	})
}

// func (api messageApi) HandleGetUndreadMessageCount(w http.ResponseWriter, r *http.Request) {
// 	roomID, err := getRoomIDFromPath(r)
// 	if err != nil {
// 		apperr.WriteJSONError(w, apperr.NewInvalidPathParamError("roomID", string(roomID)))
// 		return
// 	}
//
// 	user := getUserFromContext(r)
//
// 	count, err := api.messageService.GetUnreadMessageCount(int64(roomID), user.ID)
// 	if err != nil {
// 		apperr.WriteJSONError(w, err)
// 		return
// 	}
//
// 	WriteJSON(w, map[string]any{
// 		"unread_count": count,
// 	})
// }

// TODO: sqlc impl
func (api messageApi) HandleGetRoomsWithUndreadMessages(w http.ResponseWriter, r *http.Request) {
	panic("not impl")
	// return:
	// {
	//   unread_messages: map[roomID]bool
	// }
}

func (api messageApi) HandlePostCreateMessage(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type createMessageRequest struct {
		Content string `json:"content" validate:"required,min=1"`
	}
	var req createMessageRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	roomID, err := getRoomIDFromPath(r)
	if err != nil {
		log.Warn().Msgf("couldn't get roomID from path, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	user := getUserFromContext(r)

	message, err := api.messageService.CreateMessage(
		int64(roomID),
		int64(user.ID),
		req.Content,
	)
	if err != nil {
		log.Warn().Msgf("couldn't create new message, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("created new message: %v", message)

	WriteJSON(w, map[string]any{
		"message": message,
	})
}
