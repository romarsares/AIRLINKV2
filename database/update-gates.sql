-- Add missing gates to existing database
USE airlink_dev;

-- Add G2 and G3 gates if they don't exist
INSERT IGNORE INTO gates (gate_no, airport_id, terminal) VALUES
('G2', 1, 'G'),
('G3', 1, 'G');