# Docker Setup Guide

## Overview

This project uses Docker Compose to manage the development environment with PostgreSQL database and Prisma Studio.

## Services

- **postgres**: PostgreSQL 15 database server
- **app**: NestJS application with hot reload
- **prisma-studio**: Prisma Studio for database management

## Quick Start

### 1. Start All Services

```powershell
# Start all services in background
pnpm run docker:up

# Or manually
docker-compose up -d
```

### 2. Check Services Status

```powershell
# View logs
pnpm run docker:logs

# Or manually
docker-compose logs -f
```

### 3. Access Services

- **Application**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432

## Database Management

### Run Migrations

```powershell
# Generate migration
pnpm run db:migrate

# Or manually
npx prisma migrate dev --name "migration-name-feature-branch-name"
```

### Generate Prisma Client

```powershell
pnpm run db:generate
```

### Access Database via Prisma Studio

```powershell
# If using Docker
# Prisma Studio is automatically available at http://localhost:5555

# If running locally
pnpm run db:studio
```

## Environment Variables

### For Docker (automatic)

The docker-compose.yml automatically sets up the correct DATABASE_URL for container communication.

### For Local Development

Update your `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestjs_mvp_db?schema=public"
```

## Common Commands

### Docker Management

```powershell
# Start services
pnpm run docker:up

# Stop services
pnpm run docker:down

# Restart services
pnpm run docker:restart

# Rebuild and restart (when Dockerfile changes)
pnpm run docker:rebuild

# View logs
pnpm run docker:logs
```

### Database Commands

```powershell
# Generate Prisma client
pnpm run db:generate

# Create and run migration
pnpm run db:migrate

# Reset database (development only!)
pnpm run db:migrate:reset

# Deploy migrations (production)
pnpm run db:migrate:deploy

# Push schema changes (prototyping)
pnpm run db:push

# Pull schema from database
pnpm run db:pull

# Open Prisma Studio
pnpm run db:studio
```

## Troubleshooting

### Port Conflicts

If you get port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - '5433:5432' # Use different host port

  app:
    ports:
      - '4001:4000' # Use different host port
      - '9230:9229' # Use different debug port

  prisma-studio:
    ports:
      - '5556:5555' # Use different host port
```

### Database Connection Issues

1. Ensure PostgreSQL container is running:

   ```powershell
   docker-compose ps
   ```

2. Check PostgreSQL logs:

   ```powershell
   docker-compose logs postgres
   ```

3. Test connection:
   ```powershell
   docker-compose exec postgres psql -U postgres -d nestjs_mvp_db
   ```

### Reset Everything

If you need to start fresh:

```powershell
# Stop all services
pnpm run docker:down

# Remove volumes (WARNING: This deletes all data!)
docker-compose down -v

# Rebuild and restart
pnpm run docker:rebuild
```

## Development Workflow

1. **Start Environment**:

   ```powershell
   pnpm run docker:up
   ```

2. **Make Schema Changes**:
   - Edit `prisma/schema.prisma`
   - Run migration: `pnpm run db:migrate`

3. **Develop**:
   - Application auto-reloads on file changes
   - Use Prisma Studio for database inspection

4. **Test**:

   ```powershell
   pnpm run test
   pnpm run test:e2e
   ```

5. **Stop Environment**:
   ```powershell
   pnpm run docker:down
   ```

## Production Considerations

For production deployment:

1. Use `docker-compose.prod.yml` (create separately)
2. Use environment-specific `.env` files
3. Use `pnpm run db:migrate:deploy` instead of `db:migrate`
4. Don't expose Prisma Studio in production
5. Use proper secrets management

## File Structure

```
├── docker-compose.yml          # Docker compose configuration with all services
├── .env                       # Environment variables
├── .env.example              # Environment template
├── Dockerfile                # Application container
└── prisma/
    ├── schema.prisma        # Database schema
    └── migrations/          # Migration files
```
