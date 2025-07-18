package chatservice

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"

	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
	"miha-f.github.com/message-app/internal/pubsub"
)

type Room struct {
	ID      int64
	Clients map[*Client]bool
	// TODO(miha): Broadcast should accept Message
	Broadcast  chan *model.WebsocketMessage
	Register   chan *Client
	Unregister chan *Client
	db         *db.Queries
	pubsub     *pubsub.PubSub
}

type WebsocketMessage struct{}

func NewRoom(db *db.Queries, pubsub *pubsub.PubSub, id int64) *Room {
	return &Room{
		ID:      id,
		Clients: make(map[*Client]bool),
		// Broadcast:  make(chan Message),
		Broadcast:  make(chan *model.WebsocketMessage),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		db:         db,

		pubsub: pubsub,
	}
}

// TODO(miha): We should send message types and not []byte.

func (r *Room) Run() {
	ctx := context.Background()

	r.pubsub.Subscribe(ctx, int(r.ID), func(payload string) {
		var msg model.WebsocketMessage
		err := json.Unmarshal([]byte(payload), &msg)
		if err != nil {
			log.Printf("failed to unmarshal redis message: %v", err)
			return
		}

		if msg.SenderServerInstanceID != r.pubsub.InstanceID {
			msg.FromRedis = true
			r.Broadcast <- &msg
		}
	})

	for {
		select {
		case client := <-r.Register:
			log.Printf("Client %d connected to room %d", client.ID, r.ID)
			r.Clients[client] = true

			roomIDInt32 := int32(r.ID)
			lastMessageID, err := r.db.GetLastMessageIDInRoom(context.TODO(), &roomIDInt32)
			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				log.Printf("failed to get last message for room %d: %v", r.ID, err)
				break
			}

			if lastMessageID > 0 {
				err = r.db.UpsertRoomRead(context.TODO(), db.UpsertRoomReadParams{
					RoomID:            int32(r.ID),
					UserID:            int32(client.ID),
					LastReadMessageID: &lastMessageID,
				})
				if err != nil {
					log.Printf("failed to upsert room_read for user %d in room %d: %v", client.ID, r.ID, err)
				}
			}

		case client := <-r.Unregister:
			if _, ok := r.Clients[client]; ok {
				log.Printf("Client %d disconnected from room %d", client.ID, r.ID)
				delete(r.Clients, client)
				close(client.Send)
			}
		case msg := <-r.Broadcast:
			roomIDInt32 := int32(r.ID)
			senderIDInt32 := int32(msg.SenderID)
			r.db.CreateMessage(context.TODO(), db.CreateMessageParams{
				RoomID:   &roomIDInt32,
				SenderID: &senderIDInt32,
				Content:  msg.Content,
			})

			if !msg.FromRedis {
				msg.SenderServerInstanceID = r.pubsub.InstanceID
				if err := r.pubsub.Publish(context.TODO(), int(r.ID), *msg); err != nil {
					log.Printf("failed to publish message to redis for room %d: %v", r.ID, err)
				}
			}

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
