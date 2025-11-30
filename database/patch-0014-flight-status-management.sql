-- Patch 0014: Flight Status Management & Missed Flight Detection
-- Date: 2024-12-20
-- Task: Add comprehensive flight status tracking and automatic passenger status updates

USE airlink_db;

-- Add new booking statuses
ALTER TABLE bookings MODIFY COLUMN booking_status VARCHAR(20) DEFAULT 'Pending';
-- Possible values: Pending, Confirmed, Boarded, Missed, Cancelled

-- Add new flight statuses  
ALTER TABLE flights MODIFY COLUMN status VARCHAR(20) DEFAULT 'Scheduled';
-- Possible values: Scheduled, Boarding, Departed, Delayed, Cancelled

-- Add delay information to flights
ALTER TABLE flights ADD COLUMN delay_minutes INT DEFAULT 0;
ALTER TABLE flights ADD COLUMN new_departure_time DATETIME NULL;
ALTER TABLE flights ADD COLUMN cancellation_reason VARCHAR(255) NULL;

-- Create flight status history table
CREATE TABLE IF NOT EXISTS flight_status_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50),
    remarks VARCHAR(255),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

CREATE INDEX idx_flight_status_history ON flight_status_history(flight_id, changed_at);

SELECT 'Patch 0014 applied successfully - Flight status management enabled' as Status;
