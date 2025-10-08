export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  swagger: {
    title: 'NestJS MVP Template - User Management API',
    description:
      'API for managing users in the NestJS MVP template. Complete CRUD operations with password hashing and validation.',
    version: '1.0',
    path: 'api/docs',
  },
};
