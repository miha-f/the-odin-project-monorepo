package api

import (
	"context"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
	"miha-f.github.com/message-app/internal/pubsub"
	"miha-f.github.com/message-app/internal/service"
	chatservice "miha-f.github.com/message-app/internal/service/chat"
)

type websocketApi struct {
	validator   *validator.Validate
	upgrader    websocket.Upgrader
	hub         *chatservice.Hub
	authService *service.AuthService
	db          *db.Queries
}

func NewWebsocketApi(db *db.Queries, pubsub *pubsub.PubSub, authService *service.AuthService) *websocketApi {
	return &websocketApi{
		validator: validator.New(),
		// TODO(miha): What are some sensible values here?
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				// TODO(miha): Don't hardcode urls or return always true.
				// origin := r.Header.Get("Origin")
				// return origin == "http://localhost:5173" || origin == "http://localhost:3000" || origin == "http://localhost:8081"
				return true
			},
		},
		hub:         chatservice.NewHub(db, pubsub),
		authService: authService,
		db:          db,
	}
}

func (api websocketApi) getLogger(r *http.Request) zerolog.Logger {
	return zerolog.Ctx(r.Context()).With().Str("handler", "Websocket").Logger()
}

func (api websocketApi) HandleGetWebsocket(w http.ResponseWriter, r *http.Request) {
	log := api.getLogger(r)

	roomIDStr := r.URL.Query().Get("room_id")
	if roomIDStr == "" {
		log.Warn().Msgf("missing room_id query param")
		apperr.WriteJSONError(w, apperr.NewInvalidQueryParamError("room_id"))
		return
	}
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil {
		log.Warn().Msgf("couldn't parse room_id query param, error: %v", err)
		apperr.WriteJSONError(w, apperr.NewInvalidQueryParamError("room_id"))
		return
	}

	token := r.URL.Query().Get("token")
	if token == "" {
		log.Warn().Msgf("missing token query param")
		apperr.WriteJSONError(w, apperr.NewInvalidQueryParamError("token"))
		return
	}

	userID, err := api.authService.GetUserIDFromToken(token)
	if err != nil {
		log.Warn().Msgf("couldn't get userID from token, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	isUserInRoom, err := api.db.IsUserInRoom(context.TODO(), db.IsUserInRoomParams{
		RoomID: int32(roomID),
		UserID: int32(userID),
	})
	if err != nil {
		log.Warn().Msgf("error checking user in room, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}
	if !isUserInRoom {
		log.Warn().Msgf("user is not in this room")
		apperr.WriteJSONError(w, apperr.NewForbiddenError())
		return
	}

	room := api.hub.GetRoom(roomID)

	conn, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Warn().Msgf("error upgrading ws connection, error: %v", err)
		apperr.WriteJSONError(w, err)
		return
	}

	client := &chatservice.Client{
		ID:   userID,
		Conn: conn,
		Room: room,
		Send: make(chan *model.WebsocketMessage, 256),
	}

	log.Debug().Msg("succesfully upgraded connection to websocket")

	room.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
