-- Patch 0001: Add Airport Support to AirLink System
-- Date: 2024-01-15
-- Description: Add airports table and update schema to support multi-airport deployment
-- Default Airport: General Santos International Airport

-- Create airports table
CREATE TABLE IF NOT EXISTS airports (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add airport reference to flights table
ALTER TABLE flights 
ADD COLUMN origin_airport_id INT NOT NULL DEFAULT 1 AFTER flight_no,
ADD FOREIGN KEY (origin_airport_id) REFERENCES airports(airport_id);

-- Add airport reference to servers table  
ALTER TABLE servers
ADD COLUMN airport_id INT NOT NULL DEFAULT 1 AFTER server_id,
ADD FOREIGN KEY (airport_id) REFERENCES airports(airport_id);

-- Insert default airport: General Santos International Airport
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES 
('GES', 'General Santos International Airport', 'General Santos', 'Philippines', 'Asia/Manila');

-- Add indexes for performance
CREATE INDEX idx_flights_airport ON flights(origin_airport_id);
CREATE INDEX idx_servers_airport ON servers(airport_id);

-- Update existing records to use default airport
UPDATE flights SET origin_airport_id = 1 WHERE origin_airport_id IS NULL;
UPDATE servers SET airport_id = 1 WHERE airport_id IS NULL;