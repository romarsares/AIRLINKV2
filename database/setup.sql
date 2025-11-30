-- AirLink Database Clean Setup Script
-- Creates fresh database with complete schema

-- Drop existing database if exists
DROP DATABASE IF EXISTS airlink_dev;
DROP DATABASE IF EXISTS airlink_test;

-- Create databases
CREATE DATABASE airlink_dev;
CREATE DATABASE airlink_test;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'airlink_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON airlink_dev.* TO 'airlink_user'@'localhost';
GRANT ALL PRIVILEGES ON airlink_test.* TO 'airlink_user'@'localhost';
FLUSH PRIVILEGES;

-- Use development database
USE airlink_dev;

-- Create all tables with clean schema
-- Airports table
CREATE TABLE airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Passengers table
CREATE TABLE passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    contact_no VARCHAR(20),
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Flights table
CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_no VARCHAR(20) NOT NULL,
    origin_airport_id INT NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    gate_no VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (origin_airport_id) REFERENCES airports(airport_id)
);

-- Bracelets table
CREATE TABLE bracelets (
    bracelet_id VARCHAR(50) PRIMARY KEY,
    rfid_tag VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'Inactive',
    battery_level INT DEFAULT 100,
    last_sync_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_no VARCHAR(10),
    booking_status VARCHAR(20) DEFAULT 'Pending',
    assigned_bracelet VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (assigned_bracelet) REFERENCES bracelets(bracelet_id)
);

-- Servers table
CREATE TABLE servers (
    server_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    sync_status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airport_id) REFERENCES airports(airport_id)
);

-- Sync logs table
CREATE TABLE sync_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    bracelet_id VARCHAR(50),
    server_id INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status VARCHAR(20),
    remarks VARCHAR(255),
    FOREIGN KEY (bracelet_id) REFERENCES bracelets(bracelet_id),
    FOREIGN KEY (server_id) REFERENCES servers(server_id)
);

-- Users table for authentication
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'operator',
    full_name VARCHAR(100),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patch history table
CREATE TABLE patch_history (
    patch_id VARCHAR(20) PRIMARY KEY,
    patch_name VARCHAR(100) NOT NULL,
    description TEXT,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(50) DEFAULT 'system'
);

-- Indexes for performance
CREATE INDEX idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX idx_bookings_flight ON bookings(flight_id);
CREATE INDEX idx_flights_airport ON flights(origin_airport_id);
CREATE INDEX idx_servers_airport ON servers(airport_id);
CREATE INDEX idx_sync_logs_bracelet ON sync_logs(bracelet_id);
CREATE INDEX idx_sync_logs_timestamp ON sync_logs(timestamp);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Insert default airport: General Santos International Airport
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES 
('GES', 'General Santos International Airport', 'General Santos', 'Philippines', 'Asia/Manila');

-- Insert default admin user
-- Password: admin12354 (hashed with SHA-256)
INSERT INTO users (username, password_hash, role, full_name, email) VALUES 
('admin', SHA2('admin12354', 256), 'admin', 'System Administrator', 'admin@airlink.local');

-- Insert default operator user
INSERT INTO users (username, password_hash, role, full_name, email) VALUES 
('operator', SHA2('operator123', 256), 'operator', 'System Operator', 'operator@airlink.local');

-- Record initial setup in patch history
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('0000', 'Initial Database Setup', 'Clean database setup with complete schema, GES airport, and default admin user');

-- Show setup completion
SELECT 'AirLink Database Setup Complete' as status;
SELECT airport_name, airport_code FROM airports;
SELECT username, role, full_name FROM users;