-- Patch 0013: Flight Notifications System
-- Date: 2024-12-20
-- Task: Add flight notification system with boarding reminders

USE airlink_db;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    bracelet_id VARCHAR(50),
    notification_type VARCHAR(50) NOT NULL,
    message VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (bracelet_id) REFERENCES bracelets(bracelet_id)
);

CREATE INDEX idx_notifications_bracelet ON notifications(bracelet_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

SELECT 'Patch 0013 applied successfully - Notifications table created' as Status;
