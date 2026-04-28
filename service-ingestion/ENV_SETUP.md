# Environment Setup Guide for Scholarship Ingestion Service

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+ (local or cloud instance)
- Git (for version control)

## Step 1: Database Setup

### Option A: PostgreSQL Locally (Windows)

1. **Download and Install PostgreSQL**
   - Visit https://www.postgresql.org/download/windows/
   - Run the installer
   - Note the password you set for the `postgres` user
   - Default port: 5432

2. **Create a Database**
   ```bash
   # Open PostgreSQL command line (psql)
   psql -U postgres

   # In the psql prompt:
   CREATE DATABASE scholarships;
   \q
   ```

### Option B: PostgreSQL Cloud (Azure, AWS, Heroku)

1. **Create a cloud PostgreSQL database**
   - Get the connection string: `postgresql://user:password@host:port/database`

## Step 2: Environment Configuration

1. **Create `.env` file in `service-ingestion`**

   ```bash
   # For local PostgreSQL
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/scholarships"
   NODE_ENV="development"
   
   # For cloud PostgreSQL (example)
   # DATABASE_URL="postgresql://user:password@your-server.postgres.database.azure.com:5432/scholarships?sslmode=require"
   ```

2. **Verify connection**
   ```bash
   # Test the connection string works
   npx prisma db push
   ```

## Step 3: Install Dependencies

```bash
cd service-ingestion

# Install required packages
npm install @prisma/client axios cheerio node-cron

# Install dev dependencies
npm install --save-dev @types/node @types/cheerio typescript
```

### Package Explanations
- `@prisma/client` - ORM for database operations
- `axios` - HTTP client for scraping
- `cheerio` - jQuery-like HTML parsing
- `node-cron` - Scheduling library for cron jobs
- `@types/node` & `@types/cheerio` - TypeScript types
- `typescript` - TypeScript compiler

## Step 4: Initialize Prisma

```bash
# Navigate to service-ingestion
cd service-ingestion

# Initialize Prisma (creates prisma/ folder and schema)
npx prisma migrate dev --name init

# This command will:
# 1. Create the Prisma schema
# 2. Run migrations
# 3. Generate Prisma client
```

If you already have `prisma/schema.prisma` from this guide, skip the init and just run:

```bash
npx prisma migrate dev --name initial_schema
```

## Step 5: Verify Setup

```bash
# Generate Prisma client
npx prisma generate

# Open Prisma Studio (visual database browser)
npx prisma studio

# This opens http://localhost:5555 where you can view your schema and data
```

## Step 6: Configure Next.js

Make sure your `next.config.mjs` or `next.config.js` has proper TypeScript/Prisma support:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure experimental features are enabled if needed
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig
```

## Step 7: Start the Service

```bash
# Development mode with hot reload
npm run dev

# Production build and start
npm run build
npm start
```

## Verification Checklist

- [ ] PostgreSQL is running and accessible
- [ ] `.env` file has valid `DATABASE_URL`
- [ ] Dependencies installed: `npm ls @prisma/client axios cheerio`
- [ ] Prisma migrations ran successfully: `npx prisma migrate status`
- [ ] Prisma client generated: `npx prisma generate`
- [ ] Prisma Studio opens: `npx prisma studio`
- [ ] Next.js dev server starts: `npm run dev`
- [ ] API endpoint responds: `curl http://localhost:3002/api/ingest`

## Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
# Regenerate Prisma client
npx prisma generate

# Or reinstall
npm uninstall @prisma/client
npm install @prisma/client
```

### "Database connection refused"

```bash
# Check PostgreSQL is running
# Windows: Start PostgreSQL service in Services
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Verify connection string
# psql -U postgres -d scholarships -h localhost
```

### "Migration error: Already exists"

```bash
# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually fix schema
npx prisma migrate dev --name fix_schema
```

### "Type 'Date | null' is not assignable to type 'Date'"

```bash
# This is a TypeScript strictness issue. Check Scholarship interface
# Make sure deadline field is optional: deadline?: Date
```

### Port 3002 already in use

```bash
# Change the port in package.json scripts
"dev": "next dev -p 3003"

# Or kill the existing process
# Windows: netstat -ano | findstr :3002
# Mac/Linux: lsof -i :3002 | awk 'NR!=1 {print $2}' | xargs kill -9
```

## Environment-Specific Configuration

### Development

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/scholarships"
NODE_ENV="development"
DEBUG="*"
```

### Production (Azure)

```env
DATABASE_URL="postgresql://user:password@server.postgres.database.azure.com:5432/scholarships?sslmode=require"
NODE_ENV="production"
DEBUG=""
```

### Staging

```env
DATABASE_URL="postgresql://user:password@staging-server.com:5432/scholarships"
NODE_ENV="staging"
DEBUG="app:*"
```

## Database Backup & Recovery

### Backup PostgreSQL Database

```bash
# Export to SQL file
pg_dump -U postgres -d scholarships > scholarship_backup.sql

# Export to compressed format
pg_dump -U postgres -d scholarships | gzip > scholarship_backup.sql.gz
```

### Restore Database

```bash
# From SQL file
psql -U postgres scholarships < scholarship_backup.sql

# From compressed file
gunzip < scholarship_backup.sql.gz | psql -U postgres scholarships
```

## Performance Optimization

### Enable Query Logging

```env
# In .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/scholarships?schema=public"
DEBUG="prisma:query"
```

### Connection Pool Configuration

The default Prisma connection pool is usually sufficient, but for high-traffic scenarios:

```prisma
// In prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add for Azure PostgreSQL if needed:
  // shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

## Useful Commands

```bash
# View database schema
npx prisma db pull

# Create a new migration
npx prisma migrate dev --name add_new_field

# Check migration status
npx prisma migrate status

# Reset database (dev only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Open visual database browser
npx prisma studio

# Check schema syntax
npx prisma validate
```

## Next Steps

1. ✅ Complete all steps above
2. ✅ Test API endpoint with sample data
3. ✅ Create your first scraper
4. ✅ Set up cron job for scheduled scraping
5. ✅ Configure monitoring and alerts

See `INGESTION_GUIDE.md` for usage examples and best practices.
