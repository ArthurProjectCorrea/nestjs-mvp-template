// Global test setup
import 'reflect-metadata';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.BCRYPT_SALT_ROUNDS = '10';

// Global test timeout
jest.setTimeout(30000);

// Mock Prisma Client for tests
jest.mock('../generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}));

// Mock bcryptjs for consistent testing
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('mockedHashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Console override for cleaner test output
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: React.jsx: type is invalid')
  ) {
    return;
  }
  originalConsoleError.call(console, ...(args as []));
};
