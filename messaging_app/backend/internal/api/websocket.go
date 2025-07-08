package api

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/websocket"
	"miha-f.github.com/message-app/internal/db/queries"
	"miha-f.github.com/message-app/internal/service"
	chatservice "miha-f.github.com/message-app/internal/service/chat"
)

type websocketApi struct {
	validator   *validator.Validate
	upgrader    websocket.Upgrader
	hub         *chatservice.Hub
	authService *service.AuthService
	db          *queries.Queries
}

func NewWebsocketApi(db *queries.Queries, authService *service.AuthService) *websocketApi {
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
		hub:         chatservice.NewHub(),
		authService: authService,
		db:          db,
	}
}

func (api websocketApi) HandleGetWebsocket(w http.ResponseWriter, r *http.Request) {
	// TODO(miha): We get query params here, check that user is auther and has
	// access to given chat_room
	fmt.Println("websocket url queries: ", r.URL.Query())

	roomIDStr := r.URL.Query().Get("room_id")
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid room_id", http.StatusBadRequest)
		return
	}
	_ = roomID

	token := r.URL.Query().Get("token")
	if token == "" {
		http.Error(w, "Invalid token", http.StatusBadRequest)
		return
	}

	userID, err := api.authService.GetUserID(token)
	if err != nil {
		// TODO:
	}

	members, err := api.db.ListRoomMembers(context.TODO(), int32(roomID))
	if err != nil {
		// TODO:
	}

	fmt.Println("members: ", members)

	isMember := false
	for _, m := range members {
		if int32(userID) == m.ID {
			isMember = true
		}
	}
	if !isMember {
		// TODO: return not chat room member ee
	}

	room := api.hub.GetRoom(roomID)

	conn, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	client := &chatservice.Client{
		ID:   userID,
		Conn: conn,
		Room: room,
		Send: make(chan []byte, 256),
	}

	room.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
