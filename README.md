# NestJS MVP Template - User Management API

[![Node.js](https://img.shields.io/badge/Node.js-20.19.5-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0-red.svg)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-gray.svg)](LICENSE)

> A production-ready NestJS application featuring advanced JWT authentication with refresh token blacklisting, complete user management, and comprehensive testing.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose

### Installation

```bash
# Clone repository
git clone https://github.com/ArthurProjectCorrea/nestjs-mvp-template.git
cd nestjs-mvp-template

# Install dependencies
pnpm install

# Start with Docker
pnpm docker:up
```

### Access Points

- **API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs
- **Database Studio**: http://localhost:5555

## ✨ Key Features

### 🔐 Advanced Authentication System

- **JWT Tokens**: Access tokens (15min) + refresh tokens (30 days)
- **Token Blacklisting**: Redis-powered immediate token invalidation
- **Session Management**: Multi-session support with configurable limits
- **Password Reset**: Secure token-based password recovery
- **Audit Logging**: Complete authentication event tracking

### 👥 Complete User Management

- **CRUD Operations**: Create, read, update, delete users
- **Soft Deletes**: Safe user deactivation
- **Email Validation**: Unique email constraints
- **Role-Based Access**: Foundation for authorization

### 🛡️ Security First

- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: Comprehensive DTO validation
- **CORS Protection**: Configurable cross-origin settings
- **Environment Security**: Secrets management via environment variables

### 🏗️ Production Ready

- **Docker Containerization**: Multi-service orchestration
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for performance and security
- **Testing**: 105+ tests (unit + E2E) with coverage reports
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## 📚 API Overview

### Authentication Endpoints

```http
POST /auth/login          # User authentication
POST /auth/refresh        # Refresh access token
POST /auth/logout         # Logout specific session
POST /auth/logout-all     # Logout all sessions
GET  /auth/profile        # Get user profile (protected)
POST /auth/request-reset  # Request password reset
POST /auth/reset-password # Reset password
```

### User Management Endpoints

```http
GET    /api/v1/users      # List all users
GET    /api/v1/users/:id  # Get user by ID
POST   /api/v1/users      # Create new user
PATCH  /api/v1/users/:id  # Update user
DELETE /api/v1/users/:id  # Soft delete user
```

## 🏛️ Architecture

```
src/
├── common/           # Shared services (Redis, utilities)
├── config/           # Application configuration
├── modules/
│   ├── auth/        # Authentication module
│   └── users/       # User management module
├── prisma/          # Database service
└── utils/           # Utility functions
```

### Technology Stack

- **Framework**: NestJS 11.0.1
- **Database**: PostgreSQL 15 + Prisma ORM
- **Cache**: Redis 7.0
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

## 🧪 Testing & Quality

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:cov

# Run E2E tests
pnpm test:e2e

# Run linting
pnpm lint
```

- **Unit Tests**: Business logic validation
- **E2E Tests**: Complete API workflow testing
- **Coverage**: Detailed test coverage reports
- **Code Quality**: Automated linting and formatting

## 🚀 Deployment

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Build and deploy
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Environment Configuration

```env
# Application
NODE_ENV=production
PORT=4000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=your-jwt-secret
REFRESH_SECRET=your-refresh-secret

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

## 📖 Documentation

- **[API Reference](docs/wiki/API-Reference.md)** - Complete endpoint documentation
- **[Authentication Guide](docs/wiki/Authentication.md)** - Authentication system details
- **[Database Schema](docs/wiki/Database.md)** - Database design and models
- **[Architecture](docs/wiki/Architecture.md)** - System design and patterns
- **[Configuration](docs/wiki/Configuration.md)** - Environment setup
- **[Deployment](docs/wiki/Deployment.md)** - Production deployment guide
- **[Testing](docs/wiki/Testing.md)** - Testing strategy and procedures

## 🔧 Development

### Available Scripts

```bash
pnpm start:dev      # Development with hot reload
pnpm start:debug    # Debug mode with inspector
pnpm build         # Production build
pnpm test          # Run tests
pnpm lint          # Code linting
pnpm format        # Code formatting
```

### Database Operations

```bash
pnpm db:migrate     # Create and apply migrations
pnpm db:studio      # Open Prisma Studio
pnpm db:seed        # Seed database
pnpm db:reset       # Reset database (dev only)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Standards

- **Commits**: Conventional commits with Husky hooks
- **Code Style**: ESLint + Prettier configuration
- **Testing**: Required test coverage for new features
- **Documentation**: Update wiki documentation for changes

## 📈 Project Status

- ✅ **Core Authentication**: JWT with refresh token blacklisting
- ✅ **User Management**: Complete CRUD with soft deletes
- ✅ **Security**: Password hashing, validation, audit logging
- ✅ **Testing**: Comprehensive unit and E2E test suites
- ✅ **Documentation**: Complete wiki and API documentation
- ✅ **DevOps**: Docker containerization and CI/CD pipeline
- ✅ **Code Quality**: Linting, formatting, and pre-commit hooks

## 📄 License

This project is licensed under the UNLICENSED license.

## 🙏 Acknowledgments

Built with modern JavaScript/TypeScript technologies and best practices for scalable web applications.

---

**Repository**: https://github.com/ArthurProjectCorrea/nestjs-mvp-template
**Version**: 2.0 (Refresh Token Blacklist)
**Last Updated**: October 9, 2025
