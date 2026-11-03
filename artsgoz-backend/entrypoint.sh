#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${DB_HOST:-postgres}:${DB_PORT:-5432}..."
while ! nc -z "${DB_HOST:-postgres}" "${DB_PORT:-5432}"; do
  sleep 1
done
echo "PostgreSQL is reachable."

echo "Applying database migrations..."
/app/migrate up || true

echo "Applying seed data..."
if [ -f /app/seeds/cms_roles.sql ]; then
  PGPASSWORD="${DB_PASSWORD:-password}" psql -h "${DB_HOST:-postgres}" -p "${DB_PORT:-5432}" -U "${DB_USER:-user}" -d "${DB_NAME:-artsgoz}" -f /app/seeds/cms_roles.sql || true
fi

if [ -f /app/seeds/aksornsara_articles.sql ]; then
  PGPASSWORD="${DB_PASSWORD:-password}" psql -h "${DB_HOST:-postgres}" -p "${DB_PORT:-5432}" -U "${DB_USER:-user}" -d "${DB_NAME:-artsgoz}" -f /app/seeds/aksornsara_articles.sql || true
fi

echo "Starting Artsgoz Backend API on port ${PORT:-8080}..."
exec /app/api

