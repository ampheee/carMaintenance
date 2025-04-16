-- File: 001_create_users_table.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, -- Unique identifier for the user (UUID or custom ID)
    email TEXT UNIQUE NOT NULL, -- User's email address (must be unique)
    password_hash TEXT NOT NULL, -- Hashed password for security
    is_verified BOOLEAN NOT NULL, -- Is user verified by email confirmation 
    created_at TEXT NOT NULL DEFAULT '', -- Timestamp of creation
    updated_at TEXT NOT NULL DEFAULT ''  -- Timestamp of last update (default to empty string)
);

-- Add a comment to the table for documentation purposes
COMMENT ON TABLE users IS 'Stores user account information';

-- Add comments to individual columns
COMMENT ON COLUMN users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN users.email IS 'User''s email address (must be unique)';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for secure storage';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated';