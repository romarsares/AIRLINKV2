-- AirLink Database Setup - With Test Data
-- Run this for development with comprehensive test data

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

-- Insert default airport
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES 
('GES', 'General Santos International Airport', 'General Santos', 'Philippines', 'Asia/Manila');

-- Insert default admin users
INSERT INTO users (username, password_hash, role, full_name, email) VALUES 
('admin', SHA2('admin12354', 256), 'Admin', 'System Administrator', 'admin@airlink.com'),
('operator', SHA2('operator123', 256), 'Operator', 'System Operator', 'operator@airlink.com');

-- Insert default server
INSERT INTO servers (airport_id, location, ip_address, sync_status) VALUES 
(1, 'Terminal 1 - Main Server', '192.168.10.100', 'Active');

-- Insert 10 passengers
INSERT INTO passengers (name, email, contact_no, nationality) VALUES 
('Juan Dela Cruz', 'juan.delacruz@email.com', '+63-917-123-4567', 'Philippines'),
('Maria Santos', 'maria.santos@email.com', '+63-917-111-1111', 'Philippines'),
('John Smith', 'john.smith@email.com', '+1-555-222-3333', 'USA'),
('Akiko Tanaka', 'akiko.tanaka@email.com', '+81-90-4444-5555', 'Japan'),
('Carlos Rodriguez', 'carlos.rodriguez@email.com', '+34-666-777-888', 'Spain'),
('Emma Johnson', 'emma.johnson@email.com', '+44-7777-888-999', 'UK'),
('Li Wei', 'li.wei@email.com', '+86-138-0000-1111', 'China'),
('Ahmed Hassan', 'ahmed.hassan@email.com', '+971-50-222-3333', 'UAE'),
('Sophie Martin', 'sophie.martin@email.com', '+33-6-44-55-66-77', 'France'),
('Hans Mueller', 'hans.mueller@email.com', '+49-176-888-9999', 'Germany');

-- Insert 10 flights
INSERT INTO flights (flight_no, origin_airport_id, destination, departure_time, gate_no, status) VALUES 
('PR123', 1, 'Manila', '2024-01-15 08:30:00', 'G1', 'Scheduled'),
('PR124', 1, 'Cebu', '2024-01-15 10:15:00', 'G2', 'Scheduled'),
('5J456', 1, 'Davao', '2024-01-15 12:30:00', 'G3', 'Boarding'),
('Z2789', 1, 'Iloilo', '2024-01-15 14:45:00', 'G4', 'Scheduled'),
('PR567', 1, 'Bacolod', '2024-01-15 16:20:00', 'G5', 'Scheduled'),
('CX890', 1, 'Hong Kong', '2024-01-15 18:35:00', 'I1', 'Scheduled'),
('SQ234', 1, 'Singapore', '2024-01-15 20:10:00', 'I2', 'Scheduled'),
('NH567', 1, 'Tokyo', '2024-01-15 22:25:00', 'I3', 'Scheduled'),
('KE789', 1, 'Seoul', '2024-01-16 01:40:00', 'I4', 'Scheduled'),
('QF123', 1, 'Sydney', '2024-01-16 03:55:00', 'I5', 'Scheduled');

-- Insert 5 bracelets (all inactive initially)
INSERT INTO bracelets (bracelet_id, rfid_tag, status, battery_level) VALUES 
('GES001', 'RFID_GES_001', 'Inactive', 85),
('GES002', 'RFID_GES_002', 'Inactive', 95),
('GES003', 'RFID_GES_003', 'Inactive', 88),
('GES004', 'RFID_GES_004', 'Inactive', 15),
('GES005', 'RFID_GES_005', 'Inactive', 76);

-- Insert 10 bookings (passengers have bookings but no bracelets assigned yet)
INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status, assigned_bracelet) VALUES 
(1, 1, '15A', 'Confirmed', NULL),
(2, 2, '12B', 'Confirmed', NULL),
(3, 3, '8A', 'Confirmed', NULL),
(4, 4, '15C', 'Confirmed', NULL),
(5, 5, '22A', 'Confirmed', NULL),
(6, 6, '9B', 'Confirmed', NULL),
(7, 7, '18D', 'Confirmed', NULL),
(8, 8, '5A', 'Confirmed', NULL),
(9, 9, '11C', 'Confirmed', NULL),
(10, 10, '7B', 'Confirmed', NULL);

-- Insert initial sync logs (system initialization)
INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES 
('GES001', 1, 'Success', 'Bracelet initialized - Ready for assignment'),
('GES002', 1, 'Success', 'Bracelet initialized - Ready for assignment'),
('GES003', 1, 'Success', 'Bracelet initialized - Ready for assignment'),
('GES004', 1, 'Failed', 'Bracelet low battery - Requires charging'),
('GES005', 1, 'Success', 'Bracelet initialized - Ready for assignment');

-- Record setup completion
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('SETUP', 'Database Setup with Test Data', 'Complete database schema with 10 passengers, 10 flights, 5 bracelets for testing');

COMMIT;