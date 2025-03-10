-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;

-- Use the database
USE school_management;

-- Create schools table if it doesn't exist
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Display the table structure
DESCRIBE schools; 