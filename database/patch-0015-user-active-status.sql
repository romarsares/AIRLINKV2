-- Patch 0015: Add User Active Status
-- Date: 2024-12-20
-- Task: Add is_active column to users table for user management

USE airlink_db;

-- Add is_active column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Set all existing users as active
UPDATE users SET is_active = TRUE WHERE is_active IS NULL;

-- Create index for active users lookup
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

SELECT 'Patch 0015 applied successfully - User active status added' as Status;

-- Show updated users table structure
DESCRIBE users;