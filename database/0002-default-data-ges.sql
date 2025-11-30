-- Patch 0002: Default Data for General Santos International Airport
-- Date: 2024-01-15
-- Description: Insert default test data for GES airport deployment

-- Insert sample passenger
INSERT INTO passengers (name, email, contact_no, nationality) VALUES 
('Juan Dela Cruz', 'juan.delacruz@email.com', '+63-917-123-4567', 'Philippines');

-- Insert sample flight from General Santos
INSERT INTO flights (flight_no, origin_airport_id, destination, departure_time, gate_no, status) VALUES 
('PR123', 1, 'Manila', '2024-01-15 08:30:00', 'G1', 'Scheduled');

-- Insert sample bracelet
INSERT INTO bracelets (bracelet_id, rfid_tag, status, battery_level) VALUES 
('GES001', 'RFID_GES_001', 'Active', 98);

-- Insert sample booking
INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status, assigned_bracelet) VALUES 
(1, 1, '15A', 'Confirmed', 'GES001');

-- Insert server for General Santos Airport
INSERT INTO servers (airport_id, location, ip_address, sync_status) VALUES 
(1, 'Terminal 1 - Departure Gate Area', '192.168.10.100', 'Active');

-- Insert initial sync log
INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES 
('GES001', 1, 'Success', 'Initial bracelet assignment for GES deployment');

-- Update patch tracker
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('0002', 'Default Data for GES', 'Insert default test data for General Santos International Airport deployment');