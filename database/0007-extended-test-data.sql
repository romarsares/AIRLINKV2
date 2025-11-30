-- Patch 0007: Extended Test Data
-- Date: 2024-01-15
-- Description: Add 10 passengers, 10 flights, 5 bracelets for testing

-- Insert 10 passengers
INSERT INTO passengers (name, email, contact_no, nationality) VALUES 
('Maria Santos', 'maria.santos@email.com', '+63-917-111-1111', 'Philippines'),
('John Smith', 'john.smith@email.com', '+1-555-222-3333', 'USA'),
('Akiko Tanaka', 'akiko.tanaka@email.com', '+81-90-4444-5555', 'Japan'),
('Carlos Rodriguez', 'carlos.rodriguez@email.com', '+34-666-777-888', 'Spain'),
('Emma Johnson', 'emma.johnson@email.com', '+44-7777-888-999', 'UK'),
('Li Wei', 'li.wei@email.com', '+86-138-0000-1111', 'China'),
('Ahmed Hassan', 'ahmed.hassan@email.com', '+971-50-222-3333', 'UAE'),
('Sophie Martin', 'sophie.martin@email.com', '+33-6-44-55-66-77', 'France'),
('Hans Mueller', 'hans.mueller@email.com', '+49-176-888-9999', 'Germany'),
('Isabella Silva', 'isabella.silva@email.com', '+55-11-9999-0000', 'Brazil');

-- Insert 10 flights
INSERT INTO flights (flight_no, origin_airport_id, destination, departure_time, gate_no, status) VALUES 
('PR124', 1, 'Cebu', '2024-01-15 10:15:00', 'G2', 'Scheduled'),
('5J456', 1, 'Davao', '2024-01-15 12:30:00', 'G3', 'Boarding'),
('Z2789', 1, 'Iloilo', '2024-01-15 14:45:00', 'G4', 'Scheduled'),
('PR567', 1, 'Bacolod', '2024-01-15 16:20:00', 'G5', 'Scheduled'),
('CX890', 1, 'Hong Kong', '2024-01-15 18:35:00', 'I1', 'Scheduled'),
('SQ234', 1, 'Singapore', '2024-01-15 20:10:00', 'I2', 'Scheduled'),
('NH567', 1, 'Tokyo', '2024-01-15 22:25:00', 'I3', 'Scheduled'),
('KE789', 1, 'Seoul', '2024-01-16 01:40:00', 'I4', 'Scheduled'),
('QF123', 1, 'Sydney', '2024-01-16 03:55:00', 'I5', 'Scheduled'),
('UA456', 1, 'Los Angeles', '2024-01-16 06:15:00', 'I6', 'Scheduled');

-- Insert 5 bracelets
INSERT INTO bracelets (bracelet_id, rfid_tag, status, battery_level) VALUES 
('GES002', 'RFID_GES_002', 'Active', 95),
('GES003', 'RFID_GES_003', 'Active', 88),
('GES004', 'RFID_GES_004', 'Inactive', 92),
('GES005', 'RFID_GES_005', 'Active', 76);

-- Insert bookings (assign some bracelets)
INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status, assigned_bracelet) VALUES 
(2, 2, '12B', 'Confirmed', 'GES002'),
(3, 3, '8A', 'Confirmed', 'GES003'),
(4, 4, '15C', 'Confirmed', NULL),
(5, 5, '22A', 'Confirmed', 'GES005'),
(6, 6, '9B', 'Confirmed', NULL),
(7, 7, '18D', 'Confirmed', NULL),
(8, 8, '5A', 'Confirmed', NULL),
(9, 9, '11C', 'Confirmed', NULL),
(10, 10, '7B', 'Confirmed', NULL),
(11, 11, '14A', 'Confirmed', NULL);

-- Insert sync logs for active bracelets
INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES 
('GES002', 1, 'Success', 'Bracelet assigned to Maria Santos'),
('GES003', 1, 'Success', 'Bracelet assigned to John Smith'),
('GES005', 1, 'Success', 'Bracelet assigned to Carlos Rodriguez'),
('GES004', 1, 'Failed', 'Bracelet inactive - battery low');

-- Update patch tracker
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('0007', 'Extended Test Data', 'Added 10 passengers, 10 flights, 5 bracelets for comprehensive testing');