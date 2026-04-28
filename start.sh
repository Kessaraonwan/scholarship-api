#!/bin/sh
# Entrypoint script for services with Prisma ORM

# Try to run migrations - if no migrations exist, use db push for initial setup
if npx prisma migrate deploy 2>/dev/null; then
    echo "✓ Prisma migrations applied successfully"
else
    echo "⚠ No migrations found or migration failed, attempting db push..."
    if npx prisma db push --skip-generate; then
        echo "✓ Database synchronized with schema"
    else
        echo "✗ Failed to initialize database"
        exit 1
    fi
fi

# Start the application
npm start
