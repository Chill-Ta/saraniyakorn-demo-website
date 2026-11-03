CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id VARCHAR(255) NOT NULL,
    article_title VARCHAR(500),
    author_id VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_deleted_at ON comments(deleted_at);

CREATE TABLE IF NOT EXISTS traffic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id VARCHAR(255),
    source VARCHAR(50) NOT NULL DEFAULT 'direct',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traffic_records_article_id ON traffic_records(article_id);
CREATE INDEX IF NOT EXISTS idx_traffic_records_source ON traffic_records(source);
CREATE INDEX IF NOT EXISTS idx_traffic_records_created_at ON traffic_records(created_at);

