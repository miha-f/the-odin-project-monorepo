package api

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/websocket"
	"miha-f.github.com/message-app/internal/model"
	"miha-f.github.com/message-app/internal/service"
)

type websocketApi struct {
	validator        *validator.Validate
	websocketService *service.WebsocketService
	upgrader         websocket.Upgrader
}

func NewWebsocketApi(websocketService *service.WebsocketService) *websocketApi {
	return &websocketApi{
		validator:        validator.New(),
		websocketService: websocketService,
		// TODO(miha): What are some sensible values here?
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				// TODO(miha): Don't hardcode urls.
				origin := r.Header.Get("Origin")
				return origin == "http://localhost:5173" || origin == "http://localhost:3000"
			},
		},
	}
}

func (api websocketApi) HandleGetWebsocket(w http.ResponseWriter, r *http.Request) {
	conn, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	client := &model.WebsocketClient{
		Hub:  api.websocketService.Hub,
		Conn: conn,
		Send: make(chan []byte, 256),
	}

	client.Hub.Register <- client

	go api.websocketService.WritePump(client)
	go api.websocketService.ReadPump(client)
}
