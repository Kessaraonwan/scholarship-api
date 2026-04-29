#!/bin/sh
# Entrypoint script for services with Prisma ORM
# Safe for both development and production

set -e  # Exit on error

echo "🔧 Starting database synchronization..."

# Try to run migrations (for existing deployments with migration history)
if npx prisma migrate deploy --skip-generate 2>/dev/null; then
    echo "✓ Prisma migrations applied successfully"
    npm start
    exit 0
fi

# If migrate deploy fails, check if this is a fresh environment
echo "ℹ No migration history found - checking if database exists..."

# Try db push ONLY in development/first-time setup (safer than --accept-data-loss)
if [ "$NODE_ENV" = "development" ]; then
    echo "⚠ Development mode: attempting db push for initial setup..."
    if npx prisma db push --skip-generate --accept-data-loss; then
        echo "✓ Database synchronized with schema"
        npm start
        exit 0
    else
        echo "✗ Failed to initialize database in development mode"
        exit 1
    fi
else
    # Production mode: require explicit migration
    echo "✗ Production mode: Cannot proceed without migration history"
    echo "Run 'npx prisma migrate dev --name init' locally and commit migrations/"
    exit 1
fi
