-- Users table
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    user_id INT(36) PRIMARY KEY AUTO_INCREMENT,
    role ENUM('student', 'instructor', 'admin') NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table (specialization of Users)
DROP TABLE IF EXISTS Students;
CREATE TABLE Students (
    student_id INT(36) PRIMARY KEY,
    current_level INT DEFAULT 0,
    total_points INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Instructors table (specialization of Users)
DROP TABLE IF EXISTS Instructors;
CREATE TABLE Instructors (
    instructor_id INT(36) PRIMARY KEY,
    FOREIGN KEY (instructor_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Admins table (specialization of Users)
DROP TABLE IF EXISTS Admins;
CREATE TABLE Admins (
    admin_id INT(36) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Inserting Users
INSERT INTO Users (user_id, role, username, email, password, created_at) VALUES
(1, 'student', 'testuser', 'test@example.com', 'test123', '2025-03-25 21:09:26'),
(2, 'student', 'testuser2', 'test2@example.com', 'test123', '2025-03-25 21:47:36'),
(3, 'student', 'testuser3', 'test3@example.com', 'test123', '2025-03-25 21:47:45'),
(4, 'student', 'testuser4', 'test4@example.com', 'test123', '2025-03-25 21:47:52'),
(5, 'student', 'testuser5', 'test5@example.com', 'test123', '2025-03-25 21:48:03'),
(6, 'instructor', 'instructor1', 'instructor1@example.com', 'test123', '2025-03-25 21:49:41'),
(7, 'instructor', 'instructor2', 'instructor2@example.com', 'test123', '2025-03-25 21:49:53'),
(8, 'instructor', 'instructor3', 'instructor3@example.com', 'test123', '2025-03-25 21:50:00'),
(9, 'admin', 'admin1', 'admin1@example.com', 'test123', '2025-03-25 21:51:17'),
(10, 'admin', 'admin2', 'admin2@example.com', 'test123', '2025-03-25 21:51:27');

-- Inserting Students
INSERT INTO Students (student_id, current_level, total_points) VALUES
(1, 0, 0),
(2, 0, 0),
(3, 0, 0),
(4, 0, 0),
(5, 0, 0);

-- Inserting Instructors
INSERT INTO Instructors (instructor_id) VALUES
(6),
(7),
(8);

-- Inserting Admins
INSERT INTO Admins (admin_id) VALUES
(9),
(10);
