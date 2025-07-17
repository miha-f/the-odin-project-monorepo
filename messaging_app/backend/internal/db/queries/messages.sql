-- name: CreateMessage :one
INSERT INTO messages (room_id, sender_id, content)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ListMessagesByRoom :many
SELECT m.*, u.username AS sender_username
FROM messages m
LEFT JOIN users u ON m.sender_id = u.id
WHERE m.room_id = $1
ORDER BY m.created_at ASC
LIMIT $2 OFFSET $3;
