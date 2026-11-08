-- Seed Script: cms_roles.sql
-- Description: Insert default CMS roles for Artsgoz AksornSara Article Management

INSERT INTO cms_roles (role_name, description)
VALUES 
    ('super_admin', 'Super Administrator with full access to CMS and system settings'),
    ('editor', 'Editor with permission to review, edit, and publish articles'),
    ('writer', 'Writer with permission to draft and submit articles')
ON CONFLICT (role_name) DO NOTHING;

-- Default admin user (username: admin, password: password123)
INSERT INTO users (id, username, email, password_hash, created_at, updated_at)
VALUES (
    '622656ce-f26b-4dfa-97be-d5477a626423',
    'admin',
    'admin@artsgoz.chula.ac.th',
    '$2a$10$uBN47sv1E1OpvoJYap6aZeAbxT8P.ven7ftH6pq.nnKbOdct.IoLK',
    NOW(),
    NOW()
)
ON CONFLICT (username) DO NOTHING;


