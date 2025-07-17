package service

import (
	"context"

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

func (svc MessageService) GetLatestMessages(roomID int64, limit, offset int32) ([]model.Message, error) {
	id := int32(roomID)
	messages, err := svc.db.ListMessagesByRoom(context.TODO(), db.ListMessagesByRoomParams{
		RoomID: &id,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, apperr.NewInternalServerError()
	}

	result := make([]model.Message, 0, len(messages))

	for _, m := range messages {
		senderIDI64 := int64(*m.SenderID)
		result = append(result, model.Message{
			ID:        int64(m.ID),
			RoomID:    int64(*m.RoomID),
			SenderID:  &senderIDI64,
			Content:   m.Content,
			CreatedAt: m.CreatedAt.Time,
		})
	}

	return result, nil
}

// func (svc MessageService) GetUnreadMessageCount(roomID, userID int64) (int64, error) {
// 	roomIDInt32 := int32(roomID)
// 	messageCount, err := svc.db.GetUnreadMessagesCount(context.TODO(), db.GetUnreadMessagesCountParams{
// 		RoomID: &roomIDInt32,
// 		UserID: int32(userID),
// 	})
// 	if err != nil {
// 		return 0, apperr.NewInternalServerError()
// 	}
// 	return messageCount, nil
// }

// TODO(miha): Need to set other users message as unread if they are not online and in room.
func (svc MessageService) CreateMessage(roomID, userID int64, content string) (model.Message, error) {
	roomIDInt32 := int32(roomID)
	userIDInt32 := int32(userID)
	message, err := svc.db.CreateMessage(context.TODO(), db.CreateMessageParams{
		RoomID:   &roomIDInt32,
		SenderID: &userIDInt32,
		Content:  content,
	})
	if err != nil {
		return model.Message{}, apperr.NewInternalServerError()
	}

	senderIDI64 := int64(*message.SenderID)
	return model.Message{
		ID:        int64(message.ID),
		RoomID:    int64(*message.RoomID),
		SenderID:  &senderIDI64,
		Content:   message.Content,
		CreatedAt: message.CreatedAt.Time,
	}, nil
}
