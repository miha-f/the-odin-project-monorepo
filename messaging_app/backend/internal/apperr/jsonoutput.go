package apperr

import (
	"encoding/json"
	"net/http"
)

func EncodeJSON(w http.ResponseWriter, obj any) {
	if err := json.NewEncoder(w).Encode(obj); err != nil {
		err := NewInternalServerError()
		w.WriteHeader(err.StatusCode)
		// HACK(miha): We assume that InternalServerError has Err of type
		// string. Don't forget to update if we update NewInternalServerError.
		http.Error(w, err.Err.(string), err.StatusCode)
	}
}

func WriteJSONError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")

	switch e := err.(type) {
	case APIError:
		w.WriteHeader(e.StatusCode)
		EncodeJSON(w, map[string]any{
			"status_code": e.StatusCode,
			"error":       e.Err,
		})

	default:
		// TODO(miha): When we create logger, log error here
		err := NewInternalServerError()
		w.WriteHeader(err.StatusCode)
		EncodeJSON(w, err.Err)
	}
}
