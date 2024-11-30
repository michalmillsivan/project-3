CREATE DATABASE IF NOT EXISTS michali_travels;
USE michali_travels;

-- Table 1: Users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user'
);

-- Insert users
INSERT INTO users (first_name, last_name, email, password, role)
VALUES
('John', 'Doe', 'john.doe@example.com', 'password123', 'user'),
('Jane', 'Smith', 'jane.smith@example.com', 'password123', 'user'),
('Alice', 'Johnson', 'alice.johnson@example.com', 'password123', 'user'),
('Bob', 'Brown', 'bob.brown@example.com', 'password123', 'admin'),
('Charlie', 'Williams', 'charlie.williams@example.com', 'password123', 'user');
