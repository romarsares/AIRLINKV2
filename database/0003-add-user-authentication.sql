-- Patch 0003: Add User Authentication System
-- Date: 2024-01-15
-- Description: Add users table and default admin/operator accounts

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'operator',
    full_name VARCHAR(100),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
-- Username: admin, Password: admin12354
INSERT INTO users (username, password_hash, role, full_name, email) VALUES 
('admin', SHA2('admin12354', 256), 'admin', 'System Administrator', 'admin@airlink.local');

-- Insert default operator user  
-- Username: operator, Password: operator123
INSERT INTO users (username, password_hash, role, full_name, email) VALUES 
('operator', SHA2('operator123', 256), 'operator', 'System Operator', 'operator@airlink.local');

-- Add index for username lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Update patch tracker
INSERT INTO patch_history (patch_id, patch_name, description) VALUES 
('0003', 'Add User Authentication', 'Add users table with default admin (admin/admin12354) and operator accounts');