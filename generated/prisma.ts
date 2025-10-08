// Compatibility re-export for tests and TypeScript imports
// Some test files mock '../generated/prisma'. Ensure the module exists
// and exports PrismaClient so jest.mock can resolve it.
export { PrismaClient } from '@prisma/client';
