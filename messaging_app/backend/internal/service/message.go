package service

import (
	"context"
	"fmt"

	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
)

type MessageService struct {
	db *db.Queries
}

func NewMessageService(db *db.Queries) *MessageService {
	return &MessageService{
		db: db,
	}
}

func (svc MessageService) GetLatestMessages(roomId int64, limit, offset int32) ([]model.Message, error) {
	id := int32(roomId)
	messages, err := svc.db.ListMessagesByRoom(context.TODO(), db.ListMessagesByRoomParams{
		RoomID: &id,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	result := make([]model.Message, 0, len(messages))

	for _, m := range messages {
		senderIdI64 := int64(*m.SenderID)
		result = append(result, model.Message{
			ID:        int64(m.ID),
			RoomID:    int64(*m.RoomID),
			SenderID:  &senderIdI64,
			Content:   m.Content,
			CreatedAt: m.CreatedAt.Time,
		})
	}

	return result, nil
}

func (svc MessageService) GetUnreadMessageCount(roomId, userId int64) (int64, error) {
	roomIdI32 := int32(roomId)
	messageCount, err := svc.db.GetUnreadMessagesCount(context.TODO(), db.GetUnreadMessagesCountParams{
		RoomID: &roomIdI32,
		UserID: int32(userId),
	})
	if err != nil {
		return 0, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}
	return messageCount, nil
}

// TODO(miha): Need to set other users message as unread if they are not online and in room.
func (svc MessageService) CreateMessage(roomId, userId int64, content string) (model.Message, error) {
	roomIdI32 := int32(roomId)
	userIdI32 := int32(userId)
	message, err := svc.db.CreateMessage(context.TODO(), db.CreateMessageParams{
		RoomID:   &roomIdI32,
		SenderID: &userIdI32,
		Content:  content,
	})
	if err != nil {
		return model.Message{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	senderIdI64 := int64(*message.SenderID)
	return model.Message{
		ID:        int64(message.ID),
		RoomID:    int64(*message.RoomID),
		SenderID:  &senderIdI64,
		Content:   message.Content,
		CreatedAt: message.CreatedAt.Time,
	}, nil
}
