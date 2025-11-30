-- Reset Database Script
-- Use this to completely reset the database

DROP DATABASE IF EXISTS airlink_dev;
CREATE DATABASE airlink_dev;

-- Note: After running this, you need to run either:
-- 1. setup-clean.sql (for clean environment)
-- 2. setup-with-data.sql (for development with test data)