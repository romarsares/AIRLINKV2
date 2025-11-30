-- Assign Bracelets to Passengers Script
-- Run this after setup-with-data.sql to simulate bracelet assignments

USE airlink_dev;

-- Assign bracelets to first 3 passengers (simulating check-in process)
UPDATE bookings SET assigned_bracelet = 'GES001' WHERE booking_id = 1;
UPDATE bookings SET assigned_bracelet = 'GES002' WHERE booking_id = 2;
UPDATE bookings SET assigned_bracelet = 'GES003' WHERE booking_id = 3;

-- Activate assigned bracelets and update sync time
UPDATE bracelets SET status = 'Active', last_sync_time = NOW() WHERE bracelet_id IN ('GES001', 'GES002', 'GES003');

-- Add sync logs for bracelet assignments
INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES 
('GES001', 1, 'Success', 'Bracelet assigned to Juan Dela Cruz - Flight PR123'),
('GES002', 1, 'Success', 'Bracelet assigned to Maria Santos - Flight PR124'),
('GES003', 1, 'Success', 'Bracelet assigned to John Smith - Flight 5J456');

-- Update patch history
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('ASSIGN', 'Bracelet Assignment', 'Assigned 3 bracelets to passengers for testing bracelet functionality');

COMMIT;