-- Airport Configuration for AirLink System
-- This file contains airport-specific settings for dashboard display

USE airlink_dev;

-- Sample airports where AirLink is implemented
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES 
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA', 'America/New_York'),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'USA', 'America/Los_Angeles'),
('LHR', 'London Heathrow Airport', 'London', 'United Kingdom', 'Europe/London'),
('NRT', 'Narita International Airport', 'Tokyo', 'Japan', 'Asia/Tokyo'),
('CDG', 'Charles de Gaulle Airport', 'Paris', 'France', 'Europe/Paris');

-- Airport-specific server configurations
INSERT INTO servers (airport_id, location, ip_address, sync_status) VALUES 
(1, 'JFK Terminal 1 - Gate Area A', '192.168.1.100', 'Active'),
(1, 'JFK Terminal 4 - Gate Area B', '192.168.1.101', 'Active'),
(2, 'LAX Terminal 1 - Main Concourse', '192.168.2.100', 'Active'),
(3, 'LHR Terminal 5 - Departure Lounge', '192.168.3.100', 'Active');

-- Query to get airport info for dashboard header
-- This will be used in frontend to display current airport
SELECT 
    airport_code,
    airport_name,
    city,
    country,
    timezone
FROM airports 
WHERE airport_id = 1; -- Current airport (configurable)

-- Query for dashboard overview with airport context
SELECT 
    a.airport_name,
    a.airport_code,
    COUNT(DISTINCT f.flight_id) as total_flights,
    COUNT(DISTINCT b.booking_id) as total_bookings,
    COUNT(DISTINCT br.bracelet_id) as active_bracelets,
    COUNT(DISTINCT s.server_id) as active_servers
FROM airports a
LEFT JOIN flights f ON a.airport_id = f.origin_airport_id
LEFT JOIN bookings b ON f.flight_id = b.flight_id
LEFT JOIN bracelets br ON b.assigned_bracelet = br.bracelet_id AND br.status = 'Active'
LEFT JOIN servers s ON a.airport_id = s.airport_id AND s.sync_status = 'Active'
WHERE a.airport_id = 1
GROUP BY a.airport_id;