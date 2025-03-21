-- Create Feedback Table
-- Assume we record all feedback histories, so (student_id, problem_id) can have multiple records
DROP TABLE IF EXISTS Feedbacks;
CREATE TABLE Feedbacks (
    feedback_id INT Primary KEY AUTO_INCREMENT,
    student_id CHAR(36),
    problem_id INT,
    f_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (problem_id) REFERENCES Problems(problem_id)
);