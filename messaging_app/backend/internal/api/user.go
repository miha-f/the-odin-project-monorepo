package api

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/service"
)

type userApi struct {
	userService *service.UserService
	validator   *validator.Validate
}

func NewUserApi(userService *service.UserService) *userApi {
	return &userApi{
		validator:   validator.New(),
		userService: userService,
	}
}

func (api userApi) HandleGetUser(w http.ResponseWriter, r *http.Request) {
}

func (api userApi) HandleGetAllUsers(w http.ResponseWriter, r *http.Request) {
	type queryParams struct {
		IDs     []int32 `validate:"omitempty"`
		Limit   int     `validate:"gte=1,lte=100"`
		Offset  int     `validate:"gte=0"`
		OrderBy string  `validate:"oneof=id_asc id_desc username_asc username_desc created_at_asc created_at_desc"`
	}

	qp := queryParams{
		IDs:     parseQueryToInt32Array(r, "ids", nil),
		Limit:   parseQueryToInt(r, "limit", 50),
		Offset:  parseQueryToInt(r, "offset", 0),
		OrderBy: parseQueryToString(r, "order_by", "created_at_asc"),
	}

	if err := validateRequest(r, &qp, api.validator); err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	users, err := api.userService.GetByIDs(qp.IDs, qp.Limit, qp.Offset, qp.OrderBy)
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
		"users": users,
	})
}

func (api userApi) HandleGetMyFriends(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)
	friends, err := api.userService.GetFriends(int32(user.ID))
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
		"friends": friends,
	})
}

func (api userApi) HandleGetIncomingFriendRequests(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)
	incoming, err := api.userService.GetIncomingFriends(int32(user.ID))
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
		"incoming": incoming,
	})
}

func (api userApi) HandleCreateFriendRequest(w http.ResponseWriter, r *http.Request) {
	type friendRequest struct {
		SenderID   int `json:"sender_id" validate:"required,gt=0"`
		ReceiverID int `json:"receiver_id" validate:"required,gt=0"`
	}
	var req friendRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	err := api.userService.SendFriendRequest(int32(req.SenderID), int32(req.ReceiverID))
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
		"friend_request": req,
	})
}

func (api userApi) HandleGetOutgoingFriendRequests(w http.ResponseWriter, r *http.Request) {
	user := getUserFromContext(r)
	outgoing, err := api.userService.GetOutgoingFriends(int32(user.ID))
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
		"outgoing": outgoing,
	})
}

func (api userApi) HandleAcceptFriendRequest(w http.ResponseWriter, r *http.Request) {
	type friendRequest struct {
		SenderID   int `json:"sender_id" validate:"required,gt=0"`
		ReceiverID int `json:"receiver_id" validate:"required,gt=0"`
	}
	var req friendRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	err := api.userService.AcceptFriendRequest(int32(req.SenderID), int32(req.ReceiverID))
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	WriteJSON(w, map[string]any{
		"friend_request": req,
	})
}
