DROP TABLE test_table;

-- Create test table
CREATE TABLE test_table (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(15),
    number  INT(1)
);

-- Insert test data
INSERT INTO test_table (name, number) VALUES ('test_joy', 5);