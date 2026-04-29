#!/bin/sh
# Entrypoint script for services with Prisma ORM
# Safe for both development and production

set -e

echo "Starting database synchronization..."

if npx prisma migrate deploy --skip-generate 2>/dev/null; then
    echo "Prisma migrations applied successfully"
    npm start
    exit 0
fi

echo "No migration history found - checking if database exists..."

if [ "$NODE_ENV" = "development" ]; then
    echo "Development mode: attempting db push for initial setup..."
    if npx prisma db push --skip-generate --accept-data-loss; then
        echo "Database synchronized with schema"
        npm start
        exit 0
    else
        echo "Failed to initialize database in development mode"
        exit 1
    fi
else
    echo "Production mode: Cannot proceed without migration history"
    echo "Run 'npx prisma migrate dev --name init' locally and commit migrations/"
    exit 1
fi
