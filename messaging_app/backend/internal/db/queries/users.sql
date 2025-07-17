-- name: CreateUser :one
INSERT INTO users (username, hashed_password)
VALUES ($1, $2)
RETURNING id, username;

-- name: GetUserByUsername :one
SELECT id, username, hashed_password, created_at 
FROM users 
WHERE username = $1;

-- name: GetUserByID :one
SELECT id, username, hashed_password, created_at 
FROM users 
WHERE id = $1;

-- name: GetUsersByIDs :many
SELECT *
FROM users
WHERE (@ids::int[] IS NULL OR id = ANY(@ids))
ORDER BY
    CASE WHEN @order_by = 'id_asc' THEN users.id END ASC,
    CASE WHEN @order_by = 'id_desc' THEN users.id END DESC,
    CASE WHEN @order_by = 'username_asc' THEN users.username END ASC,
    CASE WHEN @order_by = 'username_desc' THEN users.username END DESC,
    CASE WHEN @order_by = 'created_at_asc' THEN users.created_at END ASC,
    CASE WHEN @order_by = 'created_at_desc' THEN users.created_at END DESC
LIMIT $1 OFFSET $2;
