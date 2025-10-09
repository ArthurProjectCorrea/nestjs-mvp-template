// E2E Test Setup
import 'reflect-metadata';

// Set environment variables for E2E tests
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce noise in test output

// Override DATABASE_URL for E2E tests to use localhost instead of Docker service name
process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/nestjs_mvp_db?schema=public';

// Global test timeout for E2E tests (they take longer)
jest.setTimeout(60000);

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Setup global variables if needed
declare global {
  interface Global {
    __E2E_TEST_DB_CLEANUP__: any[];
  }
}

// Initialize global cleanup array
global.__E2E_TEST_DB_CLEANUP__ = [];

// Console override for cleaner test output
const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
  // Filter out noisy logs during tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Nest application successfully started') ||
      args[0].includes('Application is running on'))
  ) {
    return;
  }
  originalConsoleLog.call(console, ...(args as []));
};
