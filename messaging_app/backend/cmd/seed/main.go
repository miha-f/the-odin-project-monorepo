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

	"miha-f.github.com/message-app/internal/db/queries"
	"miha-f.github.com/message-app/internal/model"
)

type Seed struct {
	db   *queries.Queries
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

		user, err := seed.db.CreateUser(context.Background(), queries.CreateUserParams{
			Username:       username,
			HashedPassword: string(hashedPassword),
		})
		if err != nil {
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

		room, err := seed.db.CreateRoom(context.Background(), queries.CreateRoomParams{
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
		roomIdI32 := int32(room.ID)
		userIdI32 := int32(*room.CreatedBy)
		err := seed.db.AddRoomMember(context.Background(), queries.AddRoomMemberParams{
			RoomID: roomIdI32,
			UserID: userIdI32,
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
		roomIdI32 := int32(room.ID)
		userIdI32 := int32(user.ID)

		err := seed.db.AddRoomMember(context.Background(), queries.AddRoomMemberParams{
			RoomID: roomIdI32,
			UserID: userIdI32,
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
		roomId := int32(roomMember.RoomID)
		userId := int32(roomMember.UserID)
		content := seed.fake.Lorem().Sentence(20)

		message, err := seed.db.CreateMessage(context.Background(), queries.CreateMessageParams{
			RoomID:   &roomId,
			SenderID: &userId,
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

	db := queries.New(conn)
	fake := faker.New()
	seed := Seed{db: db, fake: &fake}

	users := seed.Users(10)
	rooms := seed.Rooms(users, 100)
	roomMembers := seed.RoomMembers(rooms, users, 300)
	messages := seed.Messages(roomMembers, 3000)

	_ = messages
}
