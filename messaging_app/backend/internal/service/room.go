package service

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
)

type RoomService struct {
	pool *pgxpool.Pool
	db   *db.Queries
}

func NewRoomService(pool *pgxpool.Pool, db *db.Queries) *RoomService {
	return &RoomService{
		pool: pool,
		db:   db,
	}
}

func (svc RoomService) GetUserRooms(userID int64, limit, offset int32) ([]model.Room, error) {
	id := int32(userID)
	rooms, err := svc.db.ListUserRooms(context.TODO(), db.ListUserRoomsParams{
		CreatedBy: &id,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		return nil, apperr.NewInternalServerError()
	}

	result := make([]model.Room, 0, len(rooms))

	for _, r := range rooms {
		createdByI64 := int64(*r.CreatedBy)
		result = append(result, model.Room{
			ID:        int64(r.ID),
			Name:      r.Name,
			IsPrivate: *r.IsPrivate,
			CreatedBy: &createdByI64,
			CreatedAt: r.CreatedAt.Time,
		})
	}

	return result, nil
}

func (svc RoomService) GetRoom(roomID int64) (model.Room, error) {
	room, err := svc.db.GetRoomByID(context.TODO(), int32(roomID))
	if err != nil {
		return model.Room{}, apperr.NewInternalServerError()
	}

	createdByI64 := int64(*room.CreatedBy)
	return model.Room{
		ID:        int64(room.ID),
		Name:      room.Name,
		IsPrivate: *room.IsPrivate,
		CreatedBy: &createdByI64,
		CreatedAt: room.CreatedAt.Time,
	}, nil
}

func (svc RoomService) GetAllUsersInRoom(roomID int64) ([]model.User, error) {
	roomMembers, err := svc.db.ListRoomMembers(context.TODO(), int32(roomID))
	if err != nil {
		return nil, apperr.NewInternalServerError()
	}

	result := make([]model.User, 0, len(roomMembers))

	for _, rm := range roomMembers {
		// createdByI64 := int64(*rm.CreatedBy)
		result = append(result, model.User{
			ID:             int64(rm.ID),
			Username:       rm.Username,
			HashedPassword: "",
			CreatedAt:      rm.JoinedAt.Time,
		})
	}

	return result, nil
}

func (svc RoomService) CreateRoom(name string, isPrivate bool, createdByID int64) (model.Room, error) {
	createdByI32 := int32(createdByID)

	ctx := context.TODO()
	tx, err := svc.pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return model.Room{}, apperr.NewInternalServerError()
	}

	dbtx := svc.db.WithTx(tx)

	room, err := dbtx.CreateRoom(ctx, db.CreateRoomParams{
		Name:      &name,
		IsPrivate: &isPrivate,
		CreatedBy: &createdByI32,
	})
	if err != nil {
		tx.Rollback(ctx)
		return model.Room{}, apperr.NewInternalServerError()
	}

	err = dbtx.AddRoomMember(ctx, db.AddRoomMemberParams{
		RoomID: room.ID,
		UserID: int32(createdByID),
	})
	if err != nil {
		tx.Rollback(ctx)
		return model.Room{}, apperr.NewInternalServerError()
	}

	err = tx.Commit(ctx)
	if err != nil {
		return model.Room{}, apperr.NewInternalServerError()
	}
	return model.Room{
		ID:        int64(room.ID),
		Name:      room.Name,
		IsPrivate: *room.IsPrivate,
		CreatedBy: &createdByID,
		CreatedAt: room.CreatedAt.Time,
	}, nil
}

func (svc RoomService) IsUserInRoom(userID, roomID int64) (bool, error) {
	isUserInRoom, err := svc.db.IsUserInRoom(context.TODO(), db.IsUserInRoomParams{
		UserID: int32(userID),
		RoomID: int32(roomID),
	})
	if err != nil {
		return false, apperr.NewInternalServerError()
	}

	return isUserInRoom, nil
}
