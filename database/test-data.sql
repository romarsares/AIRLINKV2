-- AirLink Test Data
-- Sample booking: John Doe, Flight AA101, Seat 12A, Bracelet BRC001

USE airlink_dev;

-- Insert airport (JFK Airport)
INSERT INTO airports (airport_code, airport_name, city, country, timezone) VALUES 
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA', 'America/New_York');

-- Insert passenger
INSERT INTO passengers (name, email, contact_no, nationality) VALUES 
('John Doe', 'john.doe@email.com', '+1-555-0123', 'USA');

-- Insert flight
INSERT INTO flights (flight_no, origin_airport_id, destination, departure_time, gate_no, status) VALUES 
('AA101', 1, 'Los Angeles', '2024-01-15 14:30:00', 'A12', 'Scheduled');

-- Insert bracelet
INSERT INTO bracelets (bracelet_id, rfid_tag, status, battery_level) VALUES 
('BRC001', 'RFID_AA101_001', 'Active', 95);

-- Insert booking (linking passenger, flight, and bracelet)
INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status, assigned_bracelet) VALUES 
(1, 1, '12A', 'Confirmed', 'BRC001');

-- Insert server record
INSERT INTO servers (airport_id, location, ip_address, sync_status) VALUES 
(1, 'Terminal 1 - Gate Area A', '192.168.1.100', 'Active');

-- Sample sync log
INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES 
('BRC001', 1, 'Success', 'Initial bracelet assignment sync');

-- Verification query to show complete booking details with airport info
SELECT 
    b.booking_id,
    p.name as passenger_name,
    f.flight_no,
    a.airport_name as origin_airport,
    a.airport_code as origin_code,
    f.destination,
    b.seat_no,
    b.booking_status,
    b.assigned_bracelet,
    br.status as bracelet_status,
    br.battery_level
FROM bookings b
JOIN passengers p ON b.passenger_id = p.passenger_id
JOIN flights f ON b.flight_id = f.flight_id
JOIN airports a ON f.origin_airport_id = a.airport_id
JOIN bracelets br ON b.assigned_bracelet = br.bracelet_id
WHERE b.booking_id = 1;