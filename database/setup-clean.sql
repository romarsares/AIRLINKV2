-- AirLink Database Setup - Clean Schema Only
-- Run this for production or clean development environment

-- Create database
CREATE DATABASE IF NOT EXISTS airlink_dev;
USE airlink_dev;

-- Create airports table
CREATE TABLE airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC'
);

-- Create passengers table
CREATE TABLE passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    contact_no VARCHAR(20),
    nationality VARCHAR(50)
);

-- Create flights table
CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_no VARCHAR(20) NOT NULL,
    origin_airport_id INT,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    gate_no VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Scheduled',
    FOREIGN KEY (origin_airport_id) REFERENCES airports(airport_id)
);

-- Create bracelets table
CREATE TABLE bracelets (
    bracelet_id VARCHAR(50) PRIMARY KEY,
    rfid_tag VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'Inactive',
    battery_level INT DEFAULT 100,
    last_sync_time DATETIME
);

-- Create bookings table
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_no VARCHAR(10),
    booking_status VARCHAR(20) DEFAULT 'Confirmed',
    assigned_bracelet VARCHAR(50),
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (assigned_bracelet) REFERENCES bracelets(bracelet_id)
);

-- Create servers table
CREATE TABLE servers (
    server_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_id INT,
    location VARCHAR(100),
    ip_address VARCHAR(50),
    sync_status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (airport_id) REFERENCES airports(airport_id)
);

-- Create sync_logs table
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

-- Create users table for authentication
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create patch history table
CREATE TABLE patch_history (
    patch_id VARCHAR(10) PRIMARY KEY,
    patch_name VARCHAR(100),
    description TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX idx_bookings_flight ON bookings(flight_id);
CREATE INDEX idx_bookings_bracelet ON bookings(assigned_bracelet);
CREATE INDEX idx_sync_logs_bracelet ON sync_logs(bracelet_id);
CREATE INDEX idx_sync_logs_timestamp ON sync_logs(timestamp);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Insert default airport (General Santos International)
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES 
('GES', 'General Santos International Airport', 'General Santos', 'Philippines', 'Asia/Manila');

-- Insert default admin users
INSERT INTO users (username, password_hash, role, full_name, email) VALUES 
('admin', SHA2('admin12354', 256), 'Admin', 'System Administrator', 'admin@airlink.com'),
('operator', SHA2('operator123', 256), 'Operator', 'System Operator', 'operator@airlink.com');

-- Insert default server
INSERT INTO servers (airport_id, location, ip_address, sync_status) VALUES 
(1, 'Terminal 1 - Main Server', '192.168.10.100', 'Active');

-- Record setup completion
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('SETUP', 'Clean Database Setup', 'Initial clean database schema with basic configuration');

COMMIT;