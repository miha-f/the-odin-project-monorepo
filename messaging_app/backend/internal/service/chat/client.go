package chatservice

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
	// TODO(miha): We need to split messages on the frontend, so they are always
	// bellow 4KB size (including its headers, json). We need to alter our
	// message in DB, to have part and is last. On frontend we can combine
	// larger messages as one!
	maxMessageSize = 4096 // 4 KB
)

type Client struct {
	ID   int64
	Room *Room
	Conn *websocket.Conn
	Send chan *Message
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

		c.Room.Broadcast <- msg
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

			b, err := json.Marshal(&message)
			if err != nil {
				log.Println("write:", err)
				return
			}

			err = c.Conn.WriteMessage(websocket.TextMessage, b)
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
