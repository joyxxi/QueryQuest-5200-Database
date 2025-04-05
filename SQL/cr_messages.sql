DROP TABLE IF EXISTS Messages;
-- Create Messages Table
DROP TABLE IF EXISTS Messages;
CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    m_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read INT DEFAULT 0,
    PRIMARY KEY (message_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);

-- Inserting Messages
INSERT INTO Messages (message_id, sender_id, receiver_id, m_content, created_at, is_read) VALUES
(1, 1, 6, 'Hello there!', '2025-03-26 00:02:34', 0),
(2, 1, 6, 'Hello there!', '2025-03-26 00:15:01', 0),
(3, 1, 7, 'Hello 2!', '2025-03-26 00:16:19', 0),
(4, 1, 7, 'Hello 2!', '2025-03-26 04:24:38', 0);