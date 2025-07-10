package appmiddleware

import (
	"context"
	"net/http"

	"github.com/go-chi/jwtauth/v5"
	"miha-f.github.com/message-app/internal/service"
)

func AddUser() {
}

type ctxKey string

const ContextUserKey ctxKey = "user"

func AddUserToContext(userService *service.UserService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			token, claims, err := jwtauth.FromContext(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			if token == nil {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}

			usernameAny, ok := claims["username"]
			if !ok {
				http.Error(w, "Unauthorized: no sub claim", http.StatusUnauthorized)
				return
			}

			username, ok := usernameAny.(string)
			if !ok {
				http.Error(w, "auth service converting token to string error", http.StatusUnauthorized)
				return
			}

			user, err := userService.GetByUsername(username)
			if err != nil {
				http.Error(w, "Unauthorized: invalid user", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), ContextUserKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		}

		return http.HandlerFunc(fn)
	}
}
