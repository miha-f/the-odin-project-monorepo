CREATE TABLE message_reads (
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (message_id, user_id)
);

DROP TABLE IF EXISTS room_reads;
