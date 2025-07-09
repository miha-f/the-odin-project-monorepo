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

-- name: MarkMessageRead :exec
INSERT INTO message_reads (message_id, user_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: GetUnreadMessagesCount :one
SELECT COUNT(*) FROM messages m
LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = $2
WHERE m.room_id = $1 AND mr.message_id IS NULL;
