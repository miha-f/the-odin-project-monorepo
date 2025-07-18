package apperr

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type APIError struct {
	StatusCode int `json:"status_code"`
	Err        any `json:"error"`
}

func (e APIError) Error() string {
	json, err := json.Marshal(e.Err)
	if err != nil {
		return fmt.Sprintf("APIError: status_code: %d, err: couldn't marshal given error", e.StatusCode)
	}
	return fmt.Sprintf("APIError: status_code: %d, err: %s", e.StatusCode, string(json))
}

func NewAPIError(statusCode int, err any) APIError {
	return APIError{
		StatusCode: statusCode,
		Err:        err,
	}
}

func NewNotFoundError[T interface{ ~int | ~int64 | string }](resource string, id T) APIError {
	return NewAPIError(http.StatusNotFound, map[string]any{
		"resource": resource,
		"id":       id,
	})
}

func NewBadRequestError() APIError {
	return NewAPIError(http.StatusBadRequest, "bad request")
}

func NewInvalidPathParamError(param, value string) APIError {
	return NewAPIError(http.StatusBadRequest, map[string]string{
		"param": param,
		"value": value,
	})
}

func NewInvalidQueryParamError(param string) APIError {
	return NewAPIError(http.StatusBadRequest, map[string]string{
		"param": param,
	})
}

func NewInvalidJSONBodyError() APIError {
	return NewAPIError(http.StatusBadRequest, "invalid JSON body")
}

func NewValidationError(errors map[string][]string) APIError {
	return NewAPIError(http.StatusUnprocessableEntity, errors)
}

func NewInternalServerError() APIError {
	return NewAPIError(http.StatusInternalServerError, "internal server error")
}

func NewUnauthorizedError() APIError {
	return NewAPIError(http.StatusUnauthorized, "unauthorized")
}

func NewForbiddenError() APIError {
	return NewAPIError(http.StatusForbidden, "forbidden")
}

func NewDuplicateResourceError() APIError {
	return NewAPIError(http.StatusConflict, "duplicate resource")
}
