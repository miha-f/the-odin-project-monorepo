package model

import "github.com/gorilla/websocket"

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
