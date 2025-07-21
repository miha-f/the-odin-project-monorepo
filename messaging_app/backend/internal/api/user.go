package api

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog"
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

func (api userApi) getLogger(r *http.Request) zerolog.Logger {
	return zerolog.Ctx(r.Context()).With().Str("handler", "User").Logger()
}

func (api userApi) HandleGetUser(w http.ResponseWriter, r *http.Request) {
}

func (api userApi) HandleGetAllUsers(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

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

	log.Debug().Msgf("query params: %+v", qp)

	if err := validateRequest(r, &qp, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msg("succesfully validated query params")

	users, err := api.userService.GetByIDs(qp.IDs, qp.Limit, qp.Offset, qp.OrderBy)
	if err != nil {
		log.Warn().Msgf("couldn't get users with ids: %v, error: %v", qp.IDs, err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("got users: %v", users)

	WriteJSON(w, map[string]any{
		"users": users,
	})
}

func (api userApi) HandleGetMyFriends(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	user := getUserFromContext(r)
	friends, err := api.userService.GetFriends(int32(user.ID))
	if err != nil {
		log.Warn().Msgf("couldn't get user (%v) friends, error: %v", user, err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("got user (%v) friends: %v", user, friends)

	WriteJSON(w, map[string]any{
		"friends": friends,
	})
}

func (api userApi) HandleGetIncomingFriendRequests(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	user := getUserFromContext(r)
	incoming, err := api.userService.GetIncomingFriends(int32(user.ID))
	if err != nil {
		log.Warn().Msgf("couldn't get user (%v) incoming friend requests, error: %v", user, err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("got user (%v) incoming friend requests: %v", user, incoming)

	WriteJSON(w, map[string]any{
		"incoming": incoming,
	})
}

func (api userApi) HandleCreateFriendRequest(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type friendRequest struct {
		SenderID   int `json:"sender_id" validate:"required,gt=0"`
		ReceiverID int `json:"receiver_id" validate:"required,gt=0"`
	}
	var req friendRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("body: %+v", req)

	err := api.userService.SendFriendRequest(int32(req.SenderID), int32(req.ReceiverID))
	if err != nil {
		log.Warn().Msgf("couldn't send friend request, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("send friend request: from: %d, to: %d", req.SenderID, req.ReceiverID)

	WriteJSON(w, map[string]any{
		"friend_request": req,
	})
}

func (api userApi) HandleGetOutgoingFriendRequests(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	user := getUserFromContext(r)
	outgoing, err := api.userService.GetOutgoingFriends(int32(user.ID))
	if err != nil {
		log.Warn().Msgf("couldn't get outgoing friend requests, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	log.Debug().Msgf("user (%v) outgoing friend requests:", user, outgoing)

	WriteJSON(w, map[string]any{
		"outgoing": outgoing,
	})
}

func (api userApi) HandleAcceptFriendRequest(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	type friendRequest struct {
		SenderID   int `json:"sender_id" validate:"required,gt=0"`
		ReceiverID int `json:"receiver_id" validate:"required,gt=0"`
	}
	var req friendRequest
	if err := validateRequest(r, &req, api.validator); err != nil {
		log.Warn().Msgf("validation error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("body: %+v", req)

	err := api.userService.AcceptFriendRequest(int32(req.SenderID), int32(req.ReceiverID))
	if err != nil {
		log.Warn().Msgf("couldn't accept friend request, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	log.Debug().Msgf("accept friend request: from: %d, to: %d", req.SenderID, req.ReceiverID)

	WriteJSON(w, map[string]any{
		"friend_request": req,
	})
}
