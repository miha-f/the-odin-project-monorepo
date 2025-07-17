package api

import (
	"context"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/websocket"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
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

func NewWebsocketApi(db *db.Queries, authService *service.AuthService) *websocketApi {
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
		hub:         chatservice.NewHub(db),
		authService: authService,
		db:          db,
	}
}

func (api websocketApi) HandleGetWebsocket(w http.ResponseWriter, r *http.Request) {
	roomIDStr := r.URL.Query().Get("room_id")
	if roomIDStr == "" {
		apperr.WriteJSONError(w, apperr.NewInvalidQueryParamError("room_id"))
		return
	}
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil {
		apperr.WriteJSONError(w, apperr.NewInvalidQueryParamError("room_id"))
		return
	}

	token := r.URL.Query().Get("token")
	if token == "" {
		apperr.WriteJSONError(w, apperr.NewInvalidQueryParamError("token"))
		return
	}

	userID, err := api.authService.GetUserIDFromToken(token)
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	isUserInRoom, err := api.db.IsUserInRoom(context.TODO(), db.IsUserInRoomParams{
		RoomID: int32(roomID),
		UserID: int32(userID),
	})
	if !isUserInRoom {
		apperr.WriteJSONError(w, apperr.NewForbiddenError())
		return
	}
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	room := api.hub.GetRoom(roomID)

	conn, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		apperr.WriteJSONError(w, err)
		return
	}

	client := &chatservice.Client{
		ID:   userID,
		Conn: conn,
		Room: room,
		Send: make(chan *chatservice.Message, 256),
	}

	room.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
