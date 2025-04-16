-- File: 003_add_soft_delete_support.sql

-- Add a column to mark users as deleted
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Add a comment to the column for documentation purposes
COMMENT ON COLUMN users.is_deleted IS 'Flag to indicate if the user is soft-deleted';

-- Create an index on the is_deleted column for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON users (is_deleted);

-- Add a comment to the index for documentation purposes
COMMENT ON INDEX idx_users_is_deleted IS 'Index to optimize queries filtering by deletion status';