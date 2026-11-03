-- Migration: 0007_update_activity_logs_schema.up.sql
-- Description: Align activity_logs table with internal/activity model

DROP TABLE IF EXISTS activity_logs CASCADE;

CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'publish',
    action VARCHAR(500) NOT NULL,
    detail TEXT,
    article_id VARCHAR(255),
    article_title VARCHAR(500),
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    actor_id VARCHAR(255),
    actor_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_article_id ON activity_logs(article_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON activity_logs(actor_id);

