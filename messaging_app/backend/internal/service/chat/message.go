package chatservice

import "time"

type Message struct {
	Type      string    `json:"type"`
	RoomID    int64     `json:"room_id"`
	SenderID  int64     `json:"sender_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
