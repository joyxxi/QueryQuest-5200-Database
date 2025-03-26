-- Create Progress Table
DROP TABLE IF EXISTS Progress;
CREATE TABLE Progress (
    student_id INT NOT NULL,
    problem_id INT NOT NULL,
    status ENUM ('Incomplete', 'Complete') NOT NULL,
    complete_at TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (student_id, problem_id),
    FOREIGN KEY (problem_id) REFERENCES Problems(problem_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

-- Initialize Progress Table
INSERT INTO Progress (student_id, problem_id, status, complete_at)
SELECT s.student_id, p.problem_id, 'Incomplete', NULL
FROM Students s
CROSS JOIN Problems p;