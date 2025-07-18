package model

import (
	"time"

	"github.com/gorilla/websocket"
)

type WebsocketClient struct {
	Hub *WebsocketHub

	// The websocket connection.
	Conn *websocket.Conn

	// Buffered channel of outbound messages.
	Send chan []byte
}

type WebsocketHub struct {
	// Registered clients.
	Clients map[*WebsocketClient]bool

	// Inbound messages from the clients.
	Broadcast chan []byte

	// Register requests from the clients.
	Register chan *WebsocketClient

	// Unregister requests from clients.
	Unregister chan *WebsocketClient
}

type WebsocketMessage struct {
	Type                   string    `json:"type"`
	RoomID                 int64     `json:"room_id"`
	SenderID               int64     `json:"sender_id"`
	Content                string    `json:"content"`
	CreatedAt              time.Time `json:"created_at"`
	FromRedis              bool      `json:"from_redis"`
	SenderServerInstanceID string    `json:"sender_server_instance_id"`
}
