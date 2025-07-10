package apperr

import (
	"errors"
	"fmt"

	"github.com/go-playground/validator/v10"
)

var (
	ErrNotFound   = errors.New("resource not found error")
	ErrBadRequest = errors.New("bad request error")
	ErrInternal   = errors.New("internal server error")
)

type ValidationError struct {
	Errors map[string]string
}

func (v *ValidationError) Append(fe validator.FieldError) {
	if v.Errors == nil {
		v.Errors = make(map[string]string)
	}
	v.Errors[fe.Field()] = fmt.Sprintf("failed on '%s'", fe.Tag())
}

func (v ValidationError) Error() string {
	return fmt.Sprintf("validation failed: %v", v.Errors)
}
