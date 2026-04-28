#!/bin/bash

# Installation and Setup Script for Scholarship Data Ingestion System
# Run this script to set up Prisma and dependencies for the ingestion service

set -e

echo "================================"
echo "Scholarship Ingestion Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from service-ingestion directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install @prisma/client axios cheerio node-cron
npm install --save-dev @types/node @types/cheerio typescript

echo ""
echo "🔧 Initializing Prisma..."

# Check if prisma directory exists
if [ ! -d "prisma" ]; then
    echo "Creating prisma directory..."
    mkdir -p prisma
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo ""
    echo "Please create a .env file with the following content:"
    echo ""
    echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/scholarships\""
    echo "NODE_ENV=\"development\""
    echo ""
    echo "After creating .env, run: npx prisma migrate dev --name init"
    exit 1
fi

echo "✓ .env file found"

# Initialize Prisma
echo ""
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo ""
echo "📊 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the service: npm run dev"
echo "2. Test the API: curl -X POST http://localhost:3002/api/ingest -H 'Content-Type: application/json' -d '{\"source\":\"test\",\"scholarships\":[]}'"
echo "3. Check the INGESTION_GUIDE.md for usage examples"
echo ""
