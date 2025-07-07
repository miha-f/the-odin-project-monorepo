package service

import (
	"bytes"
	"log"
	"time"

	"github.com/gorilla/websocket"
	"miha-f.github.com/message-app/internal/db/queries"
	"miha-f.github.com/message-app/internal/model"
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

func (service WebsocketService) WritePump(client *model.WebsocketClient) {
	ticker := time.NewTicker(service.config.pingPeriod)
	defer func() {
		ticker.Stop()
		client.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-client.Send:
			client.Conn.SetWriteDeadline(time.Now().Add(service.config.writeWait))
			if !ok {
				// The hub closed the channel.
				client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(client.Send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-client.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			client.Conn.SetWriteDeadline(time.Now().Add(service.config.writeWait))
			if err := client.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (service WebsocketService) ReadPump(client *model.WebsocketClient) {
	defer func() {
		client.Hub.Unregister <- client
		client.Conn.Close()
	}()
	client.Conn.SetReadLimit(service.config.maxMessageSize)
	client.Conn.SetReadDeadline(time.Now().Add(service.config.pongWait))
	client.Conn.SetPongHandler(func(string) error { client.Conn.SetReadDeadline(time.Now().Add(service.config.pongWait)); return nil })
	for {
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		client.Hub.Broadcast <- message
	}
}

func runHub(hub *model.WebsocketHub) {
	for {
		select {
		case client := <-hub.Register:
			hub.Clients[client] = true
		case client := <-hub.Unregister:
			if _, ok := hub.Clients[client]; ok {
				delete(hub.Clients, client)
				close(client.Send)
			}
		case message := <-hub.Broadcast:
			for client := range hub.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(hub.Clients, client)
				}
			}
		}
	}
}

type config struct {
	// Time allowed to write a message to the peer.
	writeWait time.Duration

	// Time allowed to read the next pong message from the peer.
	pongWait time.Duration

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod time.Duration

	// Maximum message size allowed from peer.
	maxMessageSize int64
}

type WebsocketService struct {
	Hub    *model.WebsocketHub
	db     *queries.Queries
	config config
}

func NewWebsocketService(
	db *queries.Queries,
) *WebsocketService {
	hub := &model.WebsocketHub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *model.WebsocketClient),
		Unregister: make(chan *model.WebsocketClient),
		Clients:    make(map[*model.WebsocketClient]bool),
	}
	go runHub(hub)

	pongWait := 60 * time.Second

	return &WebsocketService{
		db:  db,
		Hub: hub,
		config: config{
			writeWait:      10 * time.Second,
			pongWait:       pongWait,
			pingPeriod:     (pongWait * 9) / 10,
			maxMessageSize: 512,
		},
	}
}
