-- AirLink Database Patch Tracker
-- Tracks all applied database patches for version control

CREATE TABLE IF NOT EXISTS patch_history (
    patch_id VARCHAR(20) PRIMARY KEY,
    patch_name VARCHAR(100) NOT NULL,
    description TEXT,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(50) DEFAULT 'system'
);

-- Record patch applications
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('0001', 'Add Airport Support', 'Add airports table and update schema to support multi-airport deployment with General Santos International Airport as default');

-- Query to check applied patches
SELECT * FROM patch_history ORDER BY patch_id;