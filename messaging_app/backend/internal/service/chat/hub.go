package chatservice

import "miha-f.github.com/message-app/internal/db"

type Hub struct {
	db    *db.Queries
	rooms map[int64]*Room
}

func NewHub(db *db.Queries) *Hub {
	return &Hub{
		db:    db,
		rooms: make(map[int64]*Room),
	}
}

func (h *Hub) GetRoom(id int64) *Room {
	room, ok := h.rooms[id]
	if !ok {
		room = NewRoom(h.db, id)
		h.rooms[id] = room
		go room.Run()
	}
	return room
}
