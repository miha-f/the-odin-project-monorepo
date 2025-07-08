package model

// type Message struct {
// 	Sender  string `json:"sender"`
// 	Content string `json:"content"`
// }

import "time"

type Message struct {
	ID        int64     `json:"id"`
	RoomID    int64     `json:"room_id"`
	SenderID  *int64    `json:"sender_id,omitempty"` // NULLABLE because ON DELETE SET NULL
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
