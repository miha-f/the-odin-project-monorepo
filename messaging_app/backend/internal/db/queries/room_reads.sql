-- name: UpsertRoomRead :exec
INSERT INTO room_reads (room_id, user_id, last_read_message_id, read_at)
VALUES ($1, $2, $3, now())
ON CONFLICT (room_id, user_id)
DO UPDATE SET
  last_read_message_id = EXCLUDED.last_read_message_id,
  read_at = now();

-- name: GetLastMessageIDInRoom :one
SELECT id
FROM messages
WHERE room_id = $1
ORDER BY id DESC
LIMIT 1;

-- name: GetRoomReadForUser :one
SELECT * FROM room_reads
WHERE room_id = $1 AND user_id = $2;

-- name: GetUnreadMessages :many
SELECT * FROM messages m
WHERE m.room_id = $1
  AND m.id > COALESCE(
    (SELECT last_read_message_id FROM room_reads r WHERE r.room_id = $1 AND r.user_id = $2),
    0
  )
ORDER BY created_at ASC;

-- name: GetUsersWhoReadRoom :many
SELECT user_id, last_read_message_id, read_at
FROM room_reads
WHERE room_id = $1;
