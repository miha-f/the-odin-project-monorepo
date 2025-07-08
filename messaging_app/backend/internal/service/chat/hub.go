package chatservice

type Hub struct {
	rooms map[int64]*Room
}

func NewHub() *Hub {
	return &Hub{
		rooms: make(map[int64]*Room),
	}
}

func (h *Hub) GetRoom(id int64) *Room {
	room, ok := h.rooms[id]
	if !ok {
		room = NewRoom(id)
		h.rooms[id] = room
		go room.Run()
	}
	return room
}
