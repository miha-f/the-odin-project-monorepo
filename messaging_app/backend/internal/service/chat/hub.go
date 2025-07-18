package chatservice

import (
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/pubsub"
)

type Hub struct {
	db     *db.Queries
	rooms  map[int64]*Room
	pubsub *pubsub.PubSub
}

func NewHub(db *db.Queries, pubsub *pubsub.PubSub) *Hub {
	return &Hub{
		db:     db,
		rooms:  make(map[int64]*Room),
		pubsub: pubsub,
	}
}

func (h *Hub) GetRoom(id int64) *Room {
	room, ok := h.rooms[id]
	if !ok {
		room = NewRoom(h.db, h.pubsub, id)
		h.rooms[id] = room
		go room.Run()
	}
	return room
}
