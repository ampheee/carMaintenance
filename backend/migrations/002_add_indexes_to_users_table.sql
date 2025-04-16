-- File: 002_add_indexes_to_users_table.sql

-- Create an index on the email column for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Add a comment to the index for documentation purposes
COMMENT ON INDEX idx_users_email IS 'Index to optimize queries filtering by email';