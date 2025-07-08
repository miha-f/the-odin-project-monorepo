CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE room_members (
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE message_reads (
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (message_id, user_id)
);
