-- Create Feedback Table
-- Assume we record all feedback histories, so (student_id, problem_id) can have multiple records
DROP TABLE IF EXISTS Feedback;
CREATE TABLE Feedback (
    feedback_id INT Primary KEY AUTO_INCREMENT,
    submission_id INT,
    f_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES Submissions(submission_id) ON DELETE CASCADE
    );