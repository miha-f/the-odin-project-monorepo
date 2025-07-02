package apperr

import "errors"

var (
	ErrNotFound   = errors.New("resource not found error")
	ErrBadRequest = errors.New("bad request error")
	ErrInternal   = errors.New("internal server error")
)
