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
SELECT * FROM friend_requests
WHERE receiver_id = $1 AND status = 'pending'
ORDER BY created_at DESC;

-- name: ListOutgoingFriendRequests :many
SELECT * FROM friend_requests
WHERE sender_id = $1 AND status = 'pending'
ORDER BY created_at DESC;

-- name: GetFriendsOfUser :many
SELECT u.*
FROM friendships f
JOIN users u ON
    (f.user_id = $1 AND u.id = f.friend_id)
    OR (f.friend_id = $1 AND u.id = f.user_id);

-- name: AreFriends :one
SELECT EXISTS (
    SELECT 1 FROM friendships
    WHERE (user_id = LEAST($1, $2) AND friend_id = GREATEST($1, $2))
);
