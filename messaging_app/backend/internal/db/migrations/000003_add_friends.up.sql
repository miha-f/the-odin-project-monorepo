CREATE TABLE friend_requests (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now(),
    responded_at TIMESTAMP
);

ALTER TABLE friend_requests
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled'));

-- NOTE(miha): We only keep one connection between two users, we always choose
-- lower user_id than friend_id as primary key.
CREATE TABLE friendships (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id < friend_id)
);
