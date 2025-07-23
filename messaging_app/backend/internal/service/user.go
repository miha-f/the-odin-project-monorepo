package service

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
)

type UserService struct {
	pool *pgxpool.Pool
	db   *db.Queries
}

func NewUserService(pool *pgxpool.Pool, db *db.Queries) *UserService {
	return &UserService{
		pool: pool,
		db:   db,
	}
}

func (svc UserService) Create(username, hashedPassword string) (db.CreateUserRow, error) {
	return svc.db.CreateUser(context.TODO(), db.CreateUserParams{
		Username:       username,
		HashedPassword: hashedPassword,
	})

	// TODO(miha): Handle duplicate username error
}

func (svc UserService) GetByUsername(username string) (model.User, error) {
	user, err := svc.db.GetUserByUsername(context.TODO(), username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, apperr.NewNotFoundError("username", username)
		}

		return model.User{}, apperr.NewInternalServerError()
	}

	return model.User{
		ID:        int64(user.ID),
		Username:  user.Username,
		CreatedAt: user.CreatedAt.Time,
	}, nil
}

func (svc UserService) GetByID(ID int64) (model.User, error) {
	user, err := svc.db.GetUserByID(context.TODO(), int32(ID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, apperr.NewNotFoundError("id", ID)
		}

		return model.User{}, apperr.NewInternalServerError()
	}

	return model.User{
		ID:        int64(user.ID),
		Username:  user.Username,
		CreatedAt: user.CreatedAt.Time,
	}, nil
}

func (svc UserService) GetByIDs(IDs []int32, limit, offset int, orderBy string) ([]model.User, error) {
	users, err := svc.db.GetUsersByIDs(context.TODO(), db.GetUsersByIDsParams{
		Limit:   int32(limit),
		Offset:  int32(offset),
		Ids:     IDs,
		OrderBy: orderBy,
	})
	if err != nil {
		// TODO(miha): Handle this error better
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.NewNotFoundError("ids", -1)
		}

		return nil, apperr.NewInternalServerError()
	}

	result := []model.User{}
	for _, user := range users {
		result = append(result, model.User{
			ID:        int64(user.ID),
			Username:  user.Username,
			CreatedAt: user.CreatedAt.Time,
		})
	}

	return result, nil
}

func (svc UserService) GetFriendsByIDs(IDs []int32, limit, offset int, orderBy string) ([]model.User, error) {
	panic("not impl")
}

func (svc UserService) GetFriends(userID int32) ([]model.User, error) {
	friends, err := svc.db.GetFriendsOfUser(context.TODO(), userID)
	if err != nil {
		// TODO(miha): Handle this error better
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.NewNotFoundError("ids", -1)
		}

		return nil, apperr.NewInternalServerError()
	}

	result := []model.User{}
	for _, user := range friends {
		result = append(result, model.User{
			ID:        int64(user.ID),
			Username:  user.Username,
			CreatedAt: user.CreatedAt.Time,
		})
	}

	return result, nil
}

func (svc UserService) GetIncomingFriends(userID int32) ([]model.IncomingFriendRequest, error) {
	incomingFriends, err := svc.db.ListIncomingFriendRequests(context.TODO(), userID)
	if err != nil {
		// TODO(miha): Handle this error better
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.NewNotFoundError("ids", -1)
		}

		return nil, apperr.NewInternalServerError()
	}

	result := []model.IncomingFriendRequest{}
	for _, f := range incomingFriends {
		result = append(result, model.IncomingFriendRequest{
			ID:             f.ID,
			SenderID:       f.SenderID,
			SenderUsername: f.SenderUsername,
			ReceiverID:     f.ReceiverID,
			Status:         f.Status,
			CreatedAt:      f.CreatedAt.Time,
			RespondedAt:    f.RespondedAt.Time,
		})
	}

	return result, nil
}

func (svc UserService) GetOutgoingFriends(userID int32) ([]model.OutgoingFriendRequest, error) {
	outgoingFriends, err := svc.db.ListOutgoingFriendRequests(context.TODO(), userID)
	if err != nil {
		// TODO(miha): Handle this error better
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.NewNotFoundError("ids", -1)
		}

		return nil, apperr.NewInternalServerError()
	}

	result := []model.OutgoingFriendRequest{}
	for _, f := range outgoingFriends {
		result = append(result, model.OutgoingFriendRequest{
			ID:               f.ID,
			SenderID:         f.SenderID,
			ReceiverUsername: f.ReceiverUsername,
			ReceiverID:       f.ReceiverID,
			Status:           f.Status,
			CreatedAt:        f.CreatedAt.Time,
			RespondedAt:      f.RespondedAt.Time,
		})
	}

	return result, nil
}

func (svc UserService) SendFriendRequest(senderID, receiverID int32) error {
	ctx := context.TODO()
	tx, err := svc.pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return apperr.NewInternalServerError()
	}

	dbtx := svc.db.WithTx(tx)

	areFriends, err := dbtx.AreFriends(ctx, db.AreFriendsParams{
		UserID:   senderID,
		FriendID: receiverID,
	})
	if err != nil {
		tx.Rollback(ctx)
		return apperr.NewInternalServerError()
	}

	if areFriends {
		tx.Rollback(ctx)
		return apperr.NewDuplicateResourceError()
	}

	isPending, err := dbtx.HasPendingFriendRequest(ctx, db.HasPendingFriendRequestParams{
		SenderID:   senderID,
		ReceiverID: receiverID,
	})
	if err != nil {
		tx.Rollback(ctx)
		return apperr.NewInternalServerError()
	}
	if isPending {
		tx.Rollback(ctx)
		return apperr.NewDuplicateResourceError()
	}

	err = dbtx.SendFriendRequest(ctx, db.SendFriendRequestParams{
		SenderID:   senderID,
		ReceiverID: receiverID,
	})
	if err != nil {
		tx.Rollback(ctx)
		return apperr.NewInternalServerError()
	}

	err = tx.Commit(ctx)
	if err != nil {
		return apperr.NewInternalServerError()
	}

	return nil
}

func (svc UserService) AcceptFriendRequest(senderID, receiverID int32) error {
	err := svc.db.AcceptFriendRequest(context.TODO(), db.AcceptFriendRequestParams{
		SenderID:   senderID,
		ReceiverID: receiverID,
	})
	if err != nil {
		return apperr.NewInternalServerError()
	}

	return nil
}
