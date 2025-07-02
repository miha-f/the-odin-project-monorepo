package main

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jaswdr/faker"
	"golang.org/x/crypto/bcrypt"

	"miha-f.github.com/message-app/internal/db/queries"
)

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

	q := queries.New(conn)

	fake := faker.New()

	for range 10 {
		username := fake.Internet().User()
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
		if err != nil {
			panic(err)
		}

		user, err := q.CreateUser(context.Background(), queries.CreateUserParams{
			Username:       username,
			HashedPassword: string(hashedPassword),
		})
		if err != nil {
			panic(err)
		}

		log.Printf("inserted user: %+v", user)
	}
}
