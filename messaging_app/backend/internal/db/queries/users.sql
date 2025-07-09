-- name: CreateUser :one
INSERT INTO users (username, hashed_password)
VALUES ($1, $2)
RETURNING id, username;

-- name: GetUserByUsername :one
SELECT id, username, hashed_password FROM users WHERE username = $1;

-- name: GetUserById :one
SELECT id, username, hashed_password FROM users WHERE id = $1;

