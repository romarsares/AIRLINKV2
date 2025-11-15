-- AirLink Test Data
-- Sample data for development and testing

USE airlink_dev;

-- Sample passengers
INSERT INTO passengers (name, email, contact_no, nationality) VALUES
('John Doe', 'john.doe@email.com', '+1234567890', 'USA'),
('Jane Smith', 'jane.smith@email.com', '+1987654321', 'Canada'),
('Mike Johnson', 'mike.j@email.com', '+1122334455', 'UK');

-- Sample flights
INSERT INTO flights (flight_no, destination, departure_time, gate_no, status) VALUES
('AA101', 'New York', '2024-01-15 14:30:00', 'A1', 'Scheduled'),
('BA202', 'London', '2024-01-15 16:45:00', 'B2', 'Boarding'),
('CA303', 'Toronto', '2024-01-15 18:20:00', 'C3', 'Scheduled');

-- Sample bracelets
INSERT INTO bracelets (bracelet_id, rfid_tag, status, battery_level) VALUES
('BRC001', 'RFID001', 'Active', 85),
('BRC002', 'RFID002', 'Inactive', 92),
('BRC003', 'RFID003', 'Active', 78);

-- Sample bookings
INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status, assigned_bracelet) VALUES
(1, 1, '12A', 'Confirmed', 'BRC001'),
(2, 2, '15B', 'Confirmed', 'BRC002'),
(3, 3, '8C', 'Pending', NULL);

-- Sample server
INSERT INTO servers (location, ip_address, sync_status) VALUES
('Terminal 1', '192.168.1.100', 'Active'),
('Terminal 2', '192.168.1.101', 'Active');

-- Sample sync logs
INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES
('BRC001', 1, 'Success', 'Boarding verification completed'),
('BRC002', 1, 'Failed', 'Connection timeout'),
('BRC001', 2, 'Success', 'Status update synchronized');