ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

UPDATE users SET username = SPLIT_PART(email, '@', 1) WHERE (username IS NULL OR username = '') AND email IS NOT NULL;
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);

