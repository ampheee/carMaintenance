-- File: 004_add_metadata_columns.sql

-- Add optional columns for additional user metadata
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'; -- Default role is "user"

-- Add comments to the new columns for documentation purposes
COMMENT ON COLUMN users.name IS 'User''s full name (optional)';
COMMENT ON COLUMN users.role IS 'User''s role (e.g., admin, user)';