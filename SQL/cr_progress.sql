-- Create Progress Table
DROP TABLE IF EXISTS Progress;
CREATE TABLE Progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    problem_id INT NOT NULL,
    status ENUM ('Incomplete', 'Complete') NOT NULL,
    complete_at TIMESTAMP DEFAULT NULL,
    UNIQUE(student_id, problem_id),
    FOREIGN KEY (problem_id) REFERENCES Problems(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

-- Initialize Progress Table
INSERT INTO Progress (student_id, problem_id, status, complete_at)
SELECT s.student_id, p.problem_id, 'Incomplete', NULL
FROM Students s
CROSS JOIN Problems p;