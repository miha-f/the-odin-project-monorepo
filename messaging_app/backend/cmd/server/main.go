package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"

	"miha-f.github.com/message-app/internal/api"
	"miha-f.github.com/message-app/internal/db/queries"
	"miha-f.github.com/message-app/internal/service"
)

var addr = flag.String("addr", ":8081", "http service address")

func main() {
	jwtSecret := []byte("supersecretkey")

	ctx := context.Background()

	// TODO(miha): Get this from config (that gets it from env).
	const DB_URL string = "postgres://postgres:postgres@localhost:5432/messaging_app?sslmode=disable"
	conn, err := pgx.Connect(ctx, DB_URL)
	if err != nil {
		panic(err)
	}
	defer conn.Close(ctx)

	db := queries.New(conn)

	authService := service.NewAuthService(db, []byte("secret"))
	userService := service.NewUserService(db)
	authApi := api.NewAuthApi(authService, userService)

	_, _ = jwtSecret, authApi

	flag.Parse()

	r := chi.NewRouter()
	r.Use(middleware.SetHeader("Content-Type", "application/json"))
	r.Use(middleware.Logger)
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

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(authService.GetTokenAuth()))
		r.Use(jwtauth.Authenticator(authService.GetTokenAuth()))

		r.Get("/profile", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			userID := claims["userId"]
			w.Write([]byte(fmt.Sprintf("Hello user %v", userID)))
		})
		r.Get("/me", authApi.HandleGetMe)
	})

	//
	// r.Post("/login", func(w http.ResponseWriter, r *http.Request) {
	// 	// validate user credentials...
	// 	_, tokenString, _ := tokenAuth.Encode(map[string]interface{}{
	// 		"user_id": 123,
	// 		"exp":     time.Now().Add(24 * time.Hour),
	// 	})
	// 	w.Write([]byte(tokenString))
	// })
	//
	// // Protected routes group
	// r.Group(func(r chi.Router) {
	// 	r.Use(jwtauth.Verifier(tokenAuth))      // verify JWT from Authorization header
	// 	r.Use(jwtauth.Authenticator(tokenAuth)) // handle unauthorized
	//
	// 	r.Get("/profile", func(w http.ResponseWriter, r *http.Request) {
	// 		_, claims, _ := jwtauth.FromContext(r.Context())
	// 		userID := claims["user_id"]
	// 		w.Write([]byte(fmt.Sprintf("Hello user %v", userID)))
	// 	})
	// })
	//
	// // TODO(miha): We want to have refresh token (in cookies) and normal token
	// // in local storage
	// r.Route("/auth", func(r chi.Router) {
	// 	r.Get("/register", nil)
	// 	r.Get("/login", nil)
	// })

	log.Println("Server running on: ", *addr)
	log.Fatal(http.ListenAndServe(*addr, r))
}
