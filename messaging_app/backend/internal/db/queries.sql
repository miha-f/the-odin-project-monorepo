-- name: CreateUser :one
INSERT INTO users (username, hashed_password)
VALUES ($1, $2)
RETURNING id, username;

-- name: GetUserByUsername :one
SELECT id, username, hashed_password FROM users WHERE username = $1;

-- name: CreateRoom :one
INSERT INTO rooms (name, is_private, created_by)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetRoomByID :one
SELECT * FROM rooms WHERE id = $1;

-- name: ListRooms :many
SELECT * FROM rooms
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: AddRoomMember :exec
INSERT INTO room_members (room_id, user_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: RemoveRoomMember :exec
DELETE FROM room_members
WHERE room_id = $1 AND user_id = $2;

-- name: ListRoomMembers :many
SELECT u.id, u.username, rm.joined_at
FROM room_members rm
JOIN users u ON rm.user_id = u.id
WHERE rm.room_id = $1;

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
