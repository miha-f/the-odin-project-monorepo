package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"miha-f.github.com/message-app/internal/apperr"
	"miha-f.github.com/message-app/internal/appmiddleware"
	"miha-f.github.com/message-app/internal/model"
)

func getUserFromContext(r *http.Request) model.User {
	return r.Context().Value(appmiddleware.ContextUserKey).(model.User)
}

func WriteJSON(w http.ResponseWriter, obj any) {
	// TODO(miha): Kinda sus that we go into apperr to get EncodeJSON
	apperr.EncodeJSON(w, map[string]any{
		"msg": obj,
	})
}

func parseQueryToString(r *http.Request, query string, def string) string {
	if v := r.URL.Query().Get(query); v != "" {
		return v
	}
	return def
}

func parseQueryToInt(r *http.Request, query string, def int) int {
	if v := r.URL.Query().Get(query); v != "" {
		if parsed, err := strconv.Atoi(v); err == nil {
			return parsed
		}
	}
	return def
}

func parseQueryToInt32Array(r *http.Request, query string, def []int32) []int32 {
	queryStr := r.URL.Query().Get(query)
	if queryStr == "" {
		return def
	}

	var result []int32
	if query != "" {
		queryStrArray := strings.Split(queryStr, ",")
		for _, s := range queryStrArray {
			n, err := strconv.Atoi(strings.TrimSpace(s))
			if err != nil {
				return def
			}
			result = append(result, int32(n))
		}
		return result
	}
	return def
}

func getRoomIDFromPath(r *http.Request) (int64, error) {
	roomIDStr := chi.URLParam(r, "roomID")
	roomID, err := strconv.ParseInt(roomIDStr, 10, 64)
	if err != nil {
		// TODO: log err with request ID - need to add
		return -1, apperr.NewInvalidPathParamError("roomID", roomIDStr)
	}
	return roomID, nil
}

func isUserInRoom(r *http.Request) bool {
	return r.Context().Value(appmiddleware.ContextIsUserInRoomKey).(bool)
}

func validationErrorMessage(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "is required"
	case "email":
		return "must be a valid email address"
	case "min":
		return fmt.Sprintf("must be at least %s characters", fe.Param())
	case "max":
		return fmt.Sprintf("must be at most %s characters", fe.Param())
	case "oneof":
		return fmt.Sprintf("must be one of [%s]", fe.Param())
	default:
		return fmt.Sprintf("is invalid (%s)", fe.Tag())
	}
}

func getJSONFieldName(structType reflect.Type, fe validator.FieldError) string {
	if structType.Kind() == reflect.Ptr {
		structType = structType.Elem()
	}

	// Walk nested fields if needed — usually not needed for flat structs.
	field, found := structType.FieldByName(fe.StructField())
	if !found {
		return lowerFirst(fe.Field())
	}

	jsonTag := field.Tag.Get("json")
	if jsonTag == "" || jsonTag == "-" {
		return lowerFirst(fe.Field())
	}

	return strings.SplitN(jsonTag, ",", 2)[0]
}

func lowerFirst(s string) string {
	if s == "" {
		return ""
	}
	return strings.ToLower(s[:1]) + s[1:]
}

// TODO(miha): This function seems heavy...
func validateRequest(r *http.Request, obj any, v *validator.Validate) error {
	if err := json.NewDecoder(r.Body).Decode(obj); err != nil {
		return apperr.NewInvalidJSONBodyError()
	}

	typ := reflect.TypeOf(obj)

	if err := v.Struct(obj); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			errors := make(map[string][]string)

			for _, fieldErr := range validationErrors {
				fieldName := getJSONFieldName(typ, fieldErr)
				message := validationErrorMessage(fieldErr)
				errors[fieldName] = append(errors[fieldName], message)
			}

			return apperr.NewValidationError(errors)
		}
		return err
	}

	return nil
}
