package chatservice

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type Client struct {
	ID   int64
	Room *Room
	Conn *websocket.Conn
	Send chan []byte
}

func (c *Client) ReadPump() {
	defer func() {
		c.Room.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			log.Printf("Read error: %v", err)
			break
		}

		// TODO: we can force specific format of send message here.
		// i.e. we can force FE to send '{ content: ... }'

		var incoming struct {
			Content string `json:"content"`
		}

		fmt.Println("message: ", message, string(message))

		if err := json.Unmarshal(message, &incoming); err != nil {
			log.Println("Invalid message:", err)
			continue
		}

		msg := &Message{
			Type:      "chat_message",
			RoomID:    c.Room.ID,
			SenderID:  c.ID,
			Content:   string(incoming.Content),
			CreatedAt: time.Now(),
		}

		payload, err := json.Marshal(msg)
		if err != nil {
			log.Printf("Failed to marshal message: %v", err)
			return
		}

		// TODO(miha): Save message to db

		c.Room.Broadcast <- []byte(payload)
		// c.Room.Broadcast <- Message{
		// 	SenderID: c.ID,
		// 	Data:     message,
		// }
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Room closed the channel
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			err := c.Conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Println("write:", err)
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
