-- Add users table and test users for AirLink system

USE airlink_dev;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Operator') DEFAULT 'Operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users (passwords are hashed with SHA-256)
-- admin / admin123 = ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
-- operator / operator123 = 5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5

INSERT INTO users (username, password, role) VALUES
('admin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Admin'),
('operator', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Operator');

SELECT 'Users created successfully!' as message;