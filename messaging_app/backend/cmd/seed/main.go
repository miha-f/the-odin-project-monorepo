package main

import (
	"context"
	"errors"
	"log"
	"math/rand"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jaswdr/faker"
	"golang.org/x/crypto/bcrypt"

	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/model"
)

type Seed struct {
	db   *db.Queries
	fake *faker.Faker
}

func RandomElement[T any](items []T) T {
	if len(items) == 0 {
		panic("Empty array")
	}

	result := items[rand.Intn(len(items))]
	return result
}

func (seed Seed) Users(n int) []model.User {
	users := make([]model.User, 0, n)
	for range n {
		username := seed.fake.Internet().User()
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
		if err != nil {
			panic(err)
		}

		user, err := seed.db.CreateUser(context.Background(), db.CreateUserParams{
			Username:       username,
			HashedPassword: string(hashedPassword),
		})
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23503":
					continue
				case "23505":
					log.Println("Unique constraint violation")
					continue
				}
			}
			panic(err)
		}

		users = append(users, model.User{
			ID:             int64(user.ID),
			Username:       user.Username,
			HashedPassword: string(hashedPassword),
			CreatedAt:      time.Now(),
		})

		log.Printf("inserted user: %+v", user)
	}

	return users
}

func (seed Seed) Rooms(users []model.User, n int) []model.Room {
	rooms := make([]model.Room, 0, n)

	for range n {
		name := seed.fake.Lorem().Sentence(3)
		isPrivate := seed.fake.Boolean().Bool()
		createdBy := RandomElement(users)

		createdByI32 := int32(createdBy.ID)

		room, err := seed.db.CreateRoom(context.Background(), db.CreateRoomParams{
			Name:      &name,
			IsPrivate: &isPrivate,
			CreatedBy: &createdByI32,
		})
		if err != nil {
			panic(err)
		}

		createdByI64 := createdBy.ID

		rooms = append(rooms, model.Room{
			ID:        int64(room.ID),
			Name:      &name,
			IsPrivate: isPrivate,
			CreatedBy: &createdByI64,
			CreatedAt: time.Now(),
		})

		log.Printf("inserted room: %+v", room)
	}
	return rooms
}

func (seed Seed) RoomMembers(rooms []model.Room, users []model.User, n int) []model.RoomMember {
	roomMembers := make([]model.RoomMember, 0, n+len(rooms))

	// NOTE(miha): Need to first add members for room creators.
	for _, room := range rooms {
		roomIDInt32 := int32(room.ID)
		userIDInt32 := int32(*room.CreatedBy)
		err := seed.db.AddRoomMember(context.Background(), db.AddRoomMemberParams{
			RoomID: roomIDInt32,
			UserID: userIDInt32,
		})
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23503":
					continue
				case "23505":
					log.Println("Unique constraint violation")
				}
			}
			panic(err)
		}

		roomMembers = append(roomMembers, model.RoomMember{
			RoomID:   room.ID,
			UserID:   *room.CreatedBy,
			JoinedAt: time.Now(),
		})

		log.Printf("inserted room member: [room: %s, key: (%d, %d)]", *room.Name, room.ID, *room.CreatedBy)
	}

	for range n {
		room := RandomElement(rooms)
		user := RandomElement(users)
		roomIDInt32 := int32(room.ID)
		userIDInt32 := int32(user.ID)

		err := seed.db.AddRoomMember(context.Background(), db.AddRoomMemberParams{
			RoomID: roomIDInt32,
			UserID: userIDInt32,
		})
		if err != nil {
			panic(err)
		}

		roomMembers = append(roomMembers, model.RoomMember{
			RoomID:   room.ID,
			UserID:   *room.CreatedBy,
			JoinedAt: time.Now(),
		})

		log.Printf("inserted room member: [room: %s, key: (%d, %d)]", *room.Name, room.ID, user.ID)
	}

	return roomMembers
}

func (seed Seed) Messages(roomMembers []model.RoomMember, n int) []model.Message {
	messages := make([]model.Message, 0, n)

	for range n {
		roomMember := RandomElement(roomMembers)
		roomID := int32(roomMember.RoomID)
		userID := int32(roomMember.UserID)
		content := seed.fake.Lorem().Sentence(20)

		message, err := seed.db.CreateMessage(context.Background(), db.CreateMessageParams{
			RoomID:   &roomID,
			SenderID: &userID,
			Content:  content,
		})
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23503":
					continue
				case "23505":
					log.Println("Unique constraint violation")
				}
			}
			panic(err)
		}

		log.Printf("inserted message: %+v", message)
	}

	return messages
}

func (seed Seed) MessageReads(roomMembers []model.RoomMember, n int) []model.MessageRead {
	panic("not impl")
	messages := make([]model.MessageRead, 0, n)
	return messages
}

func (seed Seed) Friendship(users []model.User) {
	for _, user := range users {
		potentialFriend := user
		for potentialFriend.ID == user.ID {
			potentialFriend = RandomElement(users)
		}
		seed.db.SendFriendRequest(context.Background(), db.SendFriendRequestParams{
			SenderID:   int32(user.ID),
			ReceiverID: int32(potentialFriend.ID),
		})
		log.Printf("user %d is sending friend request to user %d\n", user.ID, potentialFriend.ID)
	}

	for _, user := range users {
		friendRequests, err := seed.db.ListIncomingFriendRequests(context.Background(), int32(user.ID))
		if err != nil {
			panic("friendRequests err")
		}

		for _, fr := range friendRequests {
			// NOTE(miha): Accept 30% of requests
			if rand.Float32() < 0.3 {
				seed.db.AcceptFriendRequest(context.Background(), db.AcceptFriendRequestParams{
					SenderID:   int32(fr.SenderID),
					ReceiverID: int32(fr.ReceiverID),
				})
				log.Printf("user %d is accepting friend request from user %d\n", fr.ReceiverID, fr.SenderID)
			} else {
				seed.db.RejectFriendRequest(context.Background(), db.RejectFriendRequestParams{
					SenderID:   int32(fr.SenderID),
					ReceiverID: int32(fr.ReceiverID),
				})
				log.Printf("user %d is rejecting friend request from user %d\n", fr.ReceiverID, fr.SenderID)
			}
		}
	}
}

func main() {
	log.Println("Started seeding data")

	ctx := context.Background()

	// TODO(miha): Get this from config (that gets it from env).
	const DB_URL string = "postgres://postgres:postgres@localhost:5432/messaging_app?sslmode=disable"
	conn, err := pgx.Connect(ctx, DB_URL)
	if err != nil {
		panic(err)
	}
	defer conn.Close(ctx)

	db := db.New(conn)
	fake := faker.New()
	seed := Seed{db: db, fake: &fake}

	users := seed.Users(10)
	seed.Friendship(users)
	rooms := seed.Rooms(users, 100)
	roomMembers := seed.RoomMembers(rooms, users, 300)
	messages := seed.Messages(roomMembers, 3000)

	_ = messages
}
