package appmiddleware

import (
	"net/http"
	"net/url"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
)

func Zerolog(logger zerolog.Logger, serverInstanceID string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			reqID := middleware.GetReqID(r.Context())

			sanitizedURL := sanitizeURL(r.URL)

			log := logger.With().
				Str("request_id", reqID).
				Str("method", r.Method).
				Str("url", sanitizedURL).
				Str("remote_ip", r.RemoteAddr).
				Str("server_instace_id", serverInstanceID).
				Logger()

			ctx := log.WithContext(r.Context())
			r = r.WithContext(ctx)

			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			next.ServeHTTP(ww, r)

			log.Info().
				Int("status", ww.Status()).
				Int("size", ww.BytesWritten()).
				Dur("duration", time.Since(start)).
				Msg("request completed")
		}
		return http.HandlerFunc(fn)
	}
}

func sanitizeURL(u *url.URL) string {
	safeQuery := u.Query()
	if safeQuery.Has("token") {
		safeQuery.Set("token", "[redacted]")
	}
	cleaned := *u
	cleaned.RawQuery = safeQuery.Encode()
	return cleaned.String()
}
