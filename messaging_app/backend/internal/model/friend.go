package model

import "time"

type IncomingFriendRequest struct {
	ID             int32     `json:"id"`
	SenderID       int32     `json:"sender_id"`
	SenderUsername string    `json:"sender_username"`
	ReceiverID     int32     `json:"receiver_id"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	RespondedAt    time.Time `json:"responded_at"`
}

type OutgoingFriendRequest struct {
	ID               int32     `json:"id"`
	SenderID         int32     `json:"sender_id"`
	ReceiverID       int32     `json:"receiver_id"`
	ReceiverUsername string    `json:"receiver_username"`
	Status           string    `json:"status"`
	CreatedAt        time.Time `json:"created_at"`
	RespondedAt      time.Time `json:"responded_at"`
}
