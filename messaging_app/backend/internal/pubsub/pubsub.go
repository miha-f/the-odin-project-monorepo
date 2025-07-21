package pubsub

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/redis/go-redis/v9"
	"miha-f.github.com/message-app/internal/model"
)

type PubSub struct {
	client     *redis.Client
	InstanceID string
}

func NewPubSub(addr string, instanceID string) *PubSub {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "redis", // TODO: plain password
	})

	return &PubSub{
		client:     rdb,
		InstanceID: instanceID,
	}
}

func (ps PubSub) Publish(ctx context.Context, roomID int, msg model.WebsocketMessage) error {
	payload, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	channel := fmt.Sprintf("room:%d", roomID)
	return ps.client.Publish(ctx, channel, payload).Err()
}

func (ps PubSub) Subscribe(ctx context.Context, roomID int, handler func(string)) {
	go func() {
		pubsub := ps.client.Subscribe(ctx, fmt.Sprintf("room:%d", roomID))
		ch := pubsub.Channel()

		for msg := range ch {
			handler(msg.Payload)
		}
	}()
}
