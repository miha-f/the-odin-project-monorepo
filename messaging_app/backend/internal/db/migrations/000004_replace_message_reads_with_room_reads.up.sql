DROP TABLE IF EXISTS message_reads;

CREATE TABLE room_reads (
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_message_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
    read_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (room_id, user_id)
);
