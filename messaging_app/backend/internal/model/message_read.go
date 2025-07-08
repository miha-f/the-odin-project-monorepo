package model

import "time"

type MessageRead struct {
	MessageID int64     `json:"message_id"`
	UserID    int64     `json:"user_id"`
	ReadAt    time.Time `json:"read_at"`
}
