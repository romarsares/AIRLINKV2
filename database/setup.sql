-- AirLink Database Setup Script
-- Run this to set up the complete database

-- Create user and grant permissions
CREATE USER IF NOT EXISTS 'airlink_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON airlink_dev.* TO 'airlink_user'@'localhost';
GRANT ALL PRIVILEGES ON airlink_test.* TO 'airlink_user'@'localhost';
FLUSH PRIVILEGES;

-- Create development database
SOURCE schema.sql;

-- Create test database
CREATE DATABASE IF NOT EXISTS airlink_test;
USE airlink_test;
SOURCE schema.sql;

-- Load test data into development database
USE airlink_dev;
SOURCE test-data.sql;

-- Verify setup
SELECT 'Database setup complete' as status;