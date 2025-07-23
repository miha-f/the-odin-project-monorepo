package main

import (
	"context"
	"flag"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"miha-f.github.com/message-app/internal/api"
	"miha-f.github.com/message-app/internal/appmiddleware"
	"miha-f.github.com/message-app/internal/db"
	"miha-f.github.com/message-app/internal/pubsub"
	"miha-f.github.com/message-app/internal/service"
)

var addr = flag.String("addr", ":8081", "http service address")

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

func main() {
	ctx := context.Background()

	// TODO(miha): Get this from config (that gets it from env).
	DB_URL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/messaging_app?sslmode=disable")
	pool, err := pgxpool.New(ctx, DB_URL)
	if err != nil {
		panic(err)
	}
	if err := pool.Ping(ctx); err != nil {
		log.Fatal().Msgf("Unable to ping DB: %v", err)
	}

	db := db.New(pool)

	REDIS_URL := getEnv("REDIS_ADDR", "localhost:6379")
	serverInstanceID := uuid.NewString()
	pubsub := pubsub.NewPubSub(REDIS_URL, serverInstanceID)

	// TODO(miha): In each handler we pass different msg to logger. Maybe use some centralized
	// logging values i.e. applog.LogTokenError(&logger, err)
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

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
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(appmiddleware.Zerolog(log.Logger, serverInstanceID))
	// r.Use(cors.Handler(cors.Options{
	// 	// TODO(miha): Configure to specific domain once we deploy to k8s.
	// 	// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
	// 	// AllowedOrigins: []string{"https://*", "http://*"},
	// 	AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
	// 	AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	// 	AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	// 	ExposedHeaders:   []string{"Link"},
	// 	AllowCredentials: false,
	// 	MaxAge:           300, // Maximum value not ignored by any of major browsers
	// }))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:30081",
			"http://localhost:5173",
			"http://localhost",
			"http://localhost:31682",
			"http://localhost:80",
			"http://127.0.0.1:5173",
			"http://10.42.0.1",
			"http://msg-chat-frontend:8080",
			"http://msg-chat-frontend:8081",
			"http://msg-chat-frontend:80",
			"http://127.0.0.1:30081",
			"http://msg-chat-frontend",
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
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
			log.Fatal().Msgf("ListenAndServe error: %v", err)
		}
	}()

	<-stop
	log.Info().Msg("Shutting down server...")

	ctxShutDown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctxShutDown); err != nil {
		log.Fatal().Msgf("Server forced to shutdown: %v", err)
	}

	pool.Close()

	log.Info().Msg("Server exited properly")
}
