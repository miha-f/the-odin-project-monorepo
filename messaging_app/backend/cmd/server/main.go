package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"miha-f.github.com/message-app/internal/api"
	"miha-f.github.com/message-app/internal/appmiddleware"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/service"
	"miha-f.github.com/message-app/internal/pubsub"
)

var addr = flag.String("addr", ":8081", "http service address")

func main() {
	ctx := context.Background()

	// TODO(miha): Get this from config (that gets it from env).
	const DB_URL string = "postgres://postgres:postgres@localhost:5432/messaging_app?sslmode=disable"
	pool, err := pgxpool.New(ctx, DB_URL)
	if err != nil {
		panic(err)
	}
	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Unable to ping DB: %v", err)
	}

	db := db.New(pool)

    const REDIS_URL string ="localhost:6379"
    pubsub := pubsub.NewPubSub(REDIS_URL)

	// TODO: create custom store interface that has pool and sqlc db.

	userService := service.NewUserService(pool, db)
	roomService := service.NewRoomService(pool, db)
	authService := service.NewAuthService(db, []byte("secret"), userService)
	messageService := service.NewMessageService(db)

	userApi := api.NewUserApi(userService)
	authApi := api.NewAuthApi(authService, userService)
	websocketApi := api.NewWebsocketApi(db, pubsub, authService)
	roomApi := api.NewRoomApi(authService, roomService)
	messageApi := api.NewMessageApi(authService, roomService, messageService)

	flag.Parse()

	r := chi.NewRouter()
	r.Use(middleware.SetHeader("Content-Type", "application/json"))
	r.Use(middleware.Logger)
	// r.Use(middleware.RequestID) // TODO: add requestID and log with this id (this way we can log full error, but display only minimal error)
	r.Use(cors.Handler(cors.Options{
		// TODO(miha): Configure to specific domain once we deploy to k8s.
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})

	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", authApi.HandlePostRegister)
		r.Post("/login", authApi.HandlePostLogin)
	})

	// NOTE(miha): Protected routes
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(authService.GetTokenAuth()))
		// TODO: create new Authenticator middleware, so we put user to the context
		// r.Use(jwtauth.Authenticator(authService.GetTokenAuth()))
		r.Use(appmiddleware.AddUserToContext(userService))

		r.Get("/auth/me", authApi.HandleGetMe)

		r.Route("/rooms", func(r chi.Router) {
			r.Get("/me", roomApi.HandleGetUserRooms)
			r.Post("/", roomApi.HandlePostCreateRoom)

			r.Group(func(r chi.Router) {
				r.Use(appmiddleware.CheckUserHasRoomAccess(roomService))

				r.Get("/{roomID}/users", roomApi.HandleGetAllUsersInRoom)
				r.Post("/{roomID}/users", roomApi.HandlePostAddUser)
				r.Delete("/{roomID}/users", roomApi.HandleDeleteUser)

				r.Get("/{roomID}/messages", messageApi.HandleGetLatestMessages)
				r.Post("/{roomID}/messages", messageApi.HandlePostCreateMessage)
			})
		})

		r.Route("/users", func(r chi.Router) {
			r.Get("/", userApi.HandleGetAllUsers)
			r.Get("/{userID}", userApi.HandleGetUser)

			r.Get("/me/friends", userApi.HandleGetMyFriends)

			r.Get("/me/friends/incoming", userApi.HandleGetIncomingFriendRequests)
			r.Post("/me/friends/incoming", userApi.HandleAcceptFriendRequest)

			r.Get("/me/friends/outgoing", userApi.HandleGetOutgoingFriendRequests)
			r.Post("/me/friends/outgoing", userApi.HandleCreateFriendRequest)
		})

		r.Route("/messages", func(r chi.Router) {
			// r.Get("/unread/me", messageApi.HandleGetUndreadMessageCount)
		})
	})

	r.Get("/ws", websocketApi.HandleGetWebsocket)

	// TODO(miha): We need to add sensible defaults (timeouts, ...)
	srv := &http.Server{
		Addr:    *addr,
		Handler: r,
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	go func() {
		log.Printf("Server running on %s\n", *addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe error: %v", err)
		}
	}()

	<-stop
	log.Println("Shutting down server...")

	ctxShutDown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctxShutDown); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	pool.Close()

	log.Println("Server exited properly")
}
