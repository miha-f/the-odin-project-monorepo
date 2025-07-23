-- name: SendFriendRequest :exec
INSERT INTO friend_requests (sender_id, receiver_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: CancelFriendRequest :exec
UPDATE friend_requests
SET status = 'cancelled', responded_at = now()
WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending';

-- name: AcceptFriendRequest :exec
WITH updated AS (
    UPDATE friend_requests
    SET status = 'accepted', responded_at = now()
    WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'
    RETURNING sender_id, receiver_id
)
INSERT INTO friendships (user_id, friend_id)
SELECT LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
FROM updated;

-- name: RejectFriendRequest :exec
UPDATE friend_requests
SET status = 'rejected', responded_at = now()
WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending';

-- name: ListIncomingFriendRequests :many
-- SELECT * FROM friend_requests
-- WHERE receiver_id = $1 AND status = 'pending'
-- ORDER BY created_at DESC;
SELECT fr.*, u.username AS sender_username
FROM friend_requests fr
JOIN users u ON fr.sender_id = u.id
WHERE fr.receiver_id = $1 AND fr.status = 'pending'
ORDER BY fr.created_at DESC;


-- name: ListOutgoingFriendRequests :many
-- SELECT * FROM friend_requests
-- WHERE sender_id = $1 AND status = 'pending'
-- ORDER BY created_at DESC;
SELECT fr.*, u.username AS receiver_username
FROM friend_requests fr
JOIN users u ON fr.receiver_id = u.id
WHERE fr.sender_id = $1 AND fr.status = 'pending'
ORDER BY fr.created_at DESC;

-- name: HasPendingFriendRequest :one
SELECT EXISTS (
  SELECT 1 FROM friend_requests
  WHERE
    status = 'pending'
    AND (
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    )
);

-- name: GetFriendsOfUser :many
SELECT u.*
FROM friendships f
JOIN users u ON
    (f.user_id = $1 AND u.id = f.friend_id)
    OR (f.friend_id = $1 AND u.id = f.user_id);

-- name: AreFriends :one
SELECT EXISTS (
    SELECT 1 FROM friendships
    WHERE (user_id = LEAST(@user_id::int, @friend_id::int) AND friend_id = GREATEST(@user_id::int, @friend_id::int))
);
