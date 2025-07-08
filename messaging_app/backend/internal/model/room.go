package model

import "time"

type Room struct {
	ID        int64     `json:"id"`
	Name      *string   `json:"name,omitempty"` // Nullable if you want public rooms with no name
	IsPrivate bool      `json:"is_private"`
	CreatedBy *int64    `json:"created_by,omitempty"` // NULLABLE because ON DELETE SET NULL
	CreatedAt time.Time `json:"created_at"`
}
