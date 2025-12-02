-- Patch 0017: Gate Management UI Support
-- Date: 2024-12-20
-- Description: Ensure database supports gate change functionality

-- Verify flights table has required columns
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS delay_minutes INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add index for faster flight queries
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_flights_departure ON flights(departure_time);

-- Verify notifications table exists (from patch 0013)
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- Add passenger count view for flights
CREATE OR REPLACE VIEW flight_passenger_counts AS
SELECT 
    f.flight_id,
    f.flight_no,
    f.gate_no,
    f.status,
    f.departure_time,
    f.destination,
    COUNT(b.booking_id) as passenger_count
FROM flights f
LEFT JOIN bookings b ON f.flight_id = b.flight_id
GROUP BY f.flight_id;

-- Log patch application
INSERT INTO patch_tracker (patch_number, description, applied_at) 
VALUES ('0017', 'Gate Management UI Support', NOW())
ON DUPLICATE KEY UPDATE applied_at = NOW();

SELECT 'Patch 0017 applied successfully' as status;
