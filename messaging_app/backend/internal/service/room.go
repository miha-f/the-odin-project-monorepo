package service

import (
	"context"
	"fmt"

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

func (svc RoomService) GetUserRooms(userId int64, limit, offset int32) ([]model.Room, error) {
	id := int32(userId)
	rooms, err := svc.db.ListUserRooms(context.TODO(), db.ListUserRoomsParams{
		CreatedBy: &id,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		return nil, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
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

func (svc RoomService) GetRoom(roomId int64) (model.Room, error) {
	room, err := svc.db.GetRoomByID(context.TODO(), int32(roomId))
	if err != nil {
		return model.Room{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
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

func (svc RoomService) GetAllUsersInRoom(roomId int64) ([]model.User, error) {
	roomMembers, err := svc.db.ListRoomMembers(context.TODO(), int32(roomId))
	if err != nil {
		return nil, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
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

func (svc RoomService) CreateRoom(name string, isPrivate bool, createdById int64) (model.Room, error) {
	createdByI32 := int32(createdById)

	ctx := context.TODO()
	tx, err := svc.pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return model.Room{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	dbtx := svc.db.WithTx(tx)

	room, err := dbtx.CreateRoom(ctx, db.CreateRoomParams{
		Name:      &name,
		IsPrivate: &isPrivate,
		CreatedBy: &createdByI32,
	})
	if err != nil {
		tx.Rollback(ctx)
		return model.Room{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	err = dbtx.AddRoomMember(ctx, db.AddRoomMemberParams{
		RoomID: room.ID,
		UserID: int32(createdById),
	})
	if err != nil {
		tx.Rollback(ctx)
		return model.Room{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return model.Room{}, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}
	return model.Room{
		ID:        int64(room.ID),
		Name:      room.Name,
		IsPrivate: *room.IsPrivate,
		CreatedBy: &createdById,
		CreatedAt: room.CreatedAt.Time,
	}, nil
}

func (svc RoomService) IsUserInRoom(userId, roomId int64) (bool, error) {
	isUserInRoom, err := svc.db.IsUserInRoom(context.TODO(), db.IsUserInRoomParams{
		UserID: int32(userId),
		RoomID: int32(roomId),
	})
	if err != nil {
		return false, fmt.Errorf("%w: %w", apperr.ErrInternal, err)
	}

	return isUserInRoom, nil
}
