DROP TABLE IF EXISTS Problems;
DROP TABLE IF EXISTS Units;
DROP TABLE IF EXISTS Modules;

-- Modules Table
CREATE TABLE Modules (
    module_id INT PRIMARY KEY,
    module_title VARCHAR(100)
);

INSERT INTO Modules (module_id, module_title) VALUES
(1, 'SQL Fundamentals'),
(2, 'Table Design & Data Modification'),
(3, 'Joins & Advanced SQL');

-- Units Table
CREATE TABLE Units (
    unit_id INT PRIMARY KEY,
    module_id INT,
    unit_title VARCHAR(100),
    FOREIGN KEY (module_id) REFERENCES Modules(module_id) ON DELETE CASCADE
);

INSERT INTO Units (unit_id, module_id, unit_title) VALUES
-- Module 1: SQL Fundamentals
(1, 1, 'SQL Basics (keywords, syntax)'),
(2, 1, 'SELECT, FROM, WHERE'),
(3, 1, 'ORDER BY and LIMIT'),
(4, 1, 'Filtering with LIKE, IN, BETWEEN'),
(5, 1, 'Aggregation & GROUP BY'),
(6, 1, 'Filtering Aggregates with HAVING'),
-- Module 2: Table Design & Data Modification
(7, 2, 'SQL Data Types'),
(8, 2, 'Table Creation'),
(9, 2, 'INSERT and UPDATE'),
-- Module 3: Joins & Advanced SQL
(10, 3, 'Understanding JOINs'),
(11, 3, 'Foreign Keys and Relationships'),
(12, 3, 'DISTINCT, UNION, Subqueries'),
(13, 3, 'Aliases and Result Formatting');

-- Problems Table
CREATE TABLE Problems (
    problem_id INT PRIMARY KEY AUTO_INCREMENT,
    unit_id INT,
    description VARCHAR(255) NOT NULL,
    problem_type ENUM('Multi-Select', 'True-False') NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    choice1 VARCHAR(100) NOT NULL,
    choice2 VARCHAR(100) NOT NULL,
    choice3 VARCHAR(100),
    correct_answer TINYINT NOT NULL, -- index of correct choice (1/2/3)
    created_by INT(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES Units(unit_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Unit 1: SQL Basics (keywords, syntax)
INSERT INTO Problems (unit_id, description, problem_type, difficulty, choice1, choice2, choice3, correct_answer, created_by) VALUES
(1, 'SQL is case-sensitive for keywords like SELECT and FROM.', 'True-False', 'Easy', 'True', 'False', NULL, 2, NULL),
(1, 'Which of the following is a valid SQL keyword?', 'Multi-Select', 'Easy', 'SELECT', 'WHERE', 'PRINT', 1, NULL),
-- Unit 2: SELECT, FROM, WHERE
(2, 'The WHERE clause comes after the ORDER BY clause.', 'True-False', 'Easy', 'True', 'False', NULL, 2, NULL),
(2, 'Which clause is required in every SELECT statement?', 'Multi-Select', 'Medium', 'FROM', 'WHERE', 'INSERT', 1, NULL),
-- Unit 3: ORDER BY and LIMIT
(3, 'You can use LIMIT to restrict the number of results shown.', 'True-False', 'Easy', 'True', 'False', NULL, 1, NULL),
(3, 'What clause is used to sort query results?', 'Multi-Select', 'Medium', 'ORDER BY', 'SORT', 'ARRANGE', 1, NULL),
-- Unit 4: Filtering with LIKE, IN, BETWEEN
(4, 'The LIKE operator supports wildcards like % for partial matching.', 'True-False', 'Easy', 'True', 'False', NULL, 1, NULL),
(4, 'What operator is used to check if a value is within a set of values?', 'Multi-Select', 'Medium', 'BETWEEN', 'IN', 'EQUALS', 2, NULL),
-- Unit 5: Aggregation & GROUP BY
(5, 'Which of the following is an aggregate function?', 'Multi-Select', 'Easy', 'COUNT()', 'SUM()', 'LOWER()', 1, NULL),
(5, 'GROUP BY can be used without aggregate functions.', 'True-False', 'Medium', 'True', 'False', NULL, 2, NULL),
-- Unit 6: Filtering Aggregates with HAVING
(6, 'HAVING filters groups, while WHERE filters rows.', 'True-False', 'Medium', 'True', 'False', NULL, 1, NULL),
(6, 'Which clause is used to filter results in SQL?', 'Multi-Select', 'Hard', 'WHERE', 'HAVING', 'SET', 1, NULL),
-- Unit 7: SQL Data Types
(7, 'VARCHAR(255) is used for storing variable-length strings.', 'True-False', 'Easy', 'True', 'False', NULL, 1, NULL),
(7, 'Which of the following is a valid SQL data type?', 'Multi-Select', 'Easy', 'INT', 'TEXT', 'STRING', 1, NULL),
-- Unit 8: Table Creation
(8, 'Which statement belongs to Data Definition Language (DDL)?', 'Multi-Select', 'Hard', 'CREATE', 'DROP', 'INSERT', 1, NULL),
(8, 'DELETE removes a column from a table.', 'True-False', 'Easy', 'True', 'False', NULL, 2, NULL),
-- Unit 9: INSERT and UPDATE
(9, 'You can use INSERT to add multiple rows at once.', 'True-False', 'Medium', 'True', 'False', NULL, 1, NULL),
(9, 'Which SQL statement is used to modify existing data?', 'Multi-Select', 'Medium', 'UPDATE', 'DELETE', 'CREATE', 1, NULL),
-- Unit 10: Understanding JOINs
(10, 'An INNER JOIN returns only matching rows from both tables.', 'True-False', 'Easy', 'True', 'False', NULL, 1, NULL),
(10, 'LEFT JOIN may return NULL values in right table columns.', 'True-False', 'Medium', 'True', 'False', NULL, 1, NULL),
(10, 'SQL requires that joined columns have the same name.', 'True-False', 'Easy', 'True', 'False', NULL, 2, NULL),
-- Unit 11: Foreign Keys and Relationships
(11, 'Which clause is used when joining tables?', 'Multi-Select', 'Hard', 'ON', 'USING', 'IN', 1, NULL),
(11, 'What does a foreign key do?', 'Multi-Select', 'Hard', 'Links to a primary key in another table', 'Ensures referential integrity', 'Creates a new column', 1, NULL),
-- Unit 12: DISTINCT, UNION, Subqueries
(12, 'DISTINCT removes duplicate rows from the result set.', 'True-False', 'Easy', 'True', 'False', NULL, 1, NULL),
(12, 'UNION ALL removes duplicates between queries.', 'True-False', 'Medium', 'True', 'False', NULL, 2, NULL),
(12, 'A subquery can appear inside a SELECT or WHERE clause.', 'True-False', 'Hard', 'True', 'False', NULL, 1, NULL),
-- Unit 13: Aliases and Result Formatting
(13, 'Which of the following can be used to rename columns in SQL?', 'Multi-Select', 'Easy', 'AS', 'Alias', 'RENAME', 1, NULL),
(13, 'Which is a valid use case for subqueries?', 'Multi-Select', 'Medium', 'Filtering rows', 'Calculating values', 'Inserting a table', 1, NULL);




