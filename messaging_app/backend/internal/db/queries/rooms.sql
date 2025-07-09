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

