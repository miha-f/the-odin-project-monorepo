package chatservice

import "log"

type Room struct {
	ID      int64
	Clients map[*Client]bool
	// TODO(miha): Broadcast should accept Message
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

func NewRoom(id int64) *Room {
	return &Room{
		ID:      id,
		Clients: make(map[*Client]bool),
		// Broadcast:  make(chan Message),
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (r *Room) Run() {
	for {
		select {
		case client := <-r.Register:
			log.Printf("Client %d connected to room %d", client.ID, r.ID)
			r.Clients[client] = true
		case client := <-r.Unregister:
			if _, ok := r.Clients[client]; ok {
				log.Printf("Client %d disconnected from room %d", client.ID, r.ID)
				delete(r.Clients, client)
				close(client.Send)
			}
		case msg := <-r.Broadcast:
			log.Printf("Sending message %s in room %d to clients %+v", msg, r.ID, r.Clients)
			for c := range r.Clients {
				select {
				case c.Send <- msg:
				default:
					delete(r.Clients, c)
					close(c.Send)
				}
			}
		}
	}
}
