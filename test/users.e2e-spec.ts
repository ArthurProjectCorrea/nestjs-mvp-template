/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users CRUD (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Test data that will be unique for each test run
  const timestamp = Date.now();
  const uniqueEmail = `test-${timestamp}@example.com`;
  const uniqueEmail2 = `test2-${timestamp}@example.com`;
  const uniqueEmail3 = `test3-${timestamp}@example.com`;

  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Note: Cleanup removed - test users will remain in database for inspection
    await app.close();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user with valid data', async () => {
      const createUserDto = {
        name: 'Test User E2E',
        email: uniqueEmail,
        password: 'testpassword123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(createUserDto)
        .expect(201);

      // Store the created user ID for cleanup
      createdUserId = response.body.id;

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: createUserDto.name,
        email: createUserDto.email,
        role: 'user',
        isActive: true,
        createdAt: expect.any(String),
      });

      // Ensure password is not returned
      expect(response.body.password).toBeUndefined();

      // Verify user was actually created in database
      const userInDb = await prismaService.user.findUnique({
        where: { id: response.body.id },
      });
      expect(userInDb).toBeTruthy();
      expect(userInDb!.password).not.toBe(createUserDto.password); // Should be hashed
    });

    it('should return 409 when creating user with duplicate email', async () => {
      // First, create a user
      const createUserDto = {
        name: 'Test User 2 E2E',
        email: uniqueEmail2,
        password: 'testpassword123',
      };

      const firstResponse = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(createUserDto)
        .expect(201);

      // Store the created user ID for future cleanup if needed
      // createdUserId2 = firstResponse.body.id;

      // Try to create another user with the same email
      const duplicateUserDto = {
        name: 'Duplicate User',
        email: uniqueEmail2, // Same email
        password: 'anotherpassword',
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(duplicateUserDto)
        .expect(409);
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUserDto = {
        name: '', // Empty name
        email: 'invalid-email', // Invalid email format
        password: '123', // Too short password
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(invalidUserDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteUserDto = {
        name: 'Test User',
        // Missing email and password
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(incompleteUserDto)
        .expect(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return list of active users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);

      // Check if our created users are in the list
      const createdUser = response.body.data.find(
        (user: any) => user.id === createdUserId,
      );
      expect(createdUser).toBeTruthy();
      expect(createdUser.password).toBeUndefined(); // Password should not be exposed
    });

    it('should return users sorted by creation date (newest first)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(200);

      const users = response.body.data;
      if (users.length > 1) {
        // Check if users are sorted by createdAt in descending order
        for (let i = 0; i < users.length - 1; i++) {
          const currentDate = new Date(users[i].createdAt);
          const nextDate = new Date(users[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(
            nextDate.getTime(),
          );
        }
      }
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by valid ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdUserId,
        name: 'Test User E2E',
        email: uniqueEmail,
        role: 'user',
        isActive: true,
        createdAt: expect.any(String),
      });

      expect(response.body.password).toBeUndefined();
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = 999999;
      await request(app.getHttpServer())
        .get(`/api/v1/users/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid user ID format', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/invalid-id')
        .expect(400);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should update user with valid data', async () => {
      const updateUserDto = {
        name: 'Updated Test User E2E',
        email: uniqueEmail3,
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdUserId}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdUserId,
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: 'user',
        isActive: true,
      });

      // Verify update in database
      const userInDb = await prismaService.user.findUnique({
        where: { id: createdUserId },
      });
      expect(userInDb).toBeTruthy();
      expect(userInDb!.name).toBe(updateUserDto.name);
      expect(userInDb!.email).toBe(updateUserDto.email);
    });

    it('should update user password and hash it', async () => {
      const updatePasswordDto = {
        password: 'newpassword123',
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdUserId}`)
        .send(updatePasswordDto)
        .expect(200);

      // Verify password was hashed in database
      const userInDb = await prismaService.user.findUnique({
        where: { id: createdUserId },
      });
      expect(userInDb).toBeTruthy();
      expect(userInDb!.password).not.toBe(updatePasswordDto.password);
      expect(userInDb!.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should return 409 when updating email to existing one', async () => {
      const conflictEmailDto = {
        email: uniqueEmail2, // Email of user2
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdUserId}`)
        .send(conflictEmailDto)
        .expect(409);
    });

    it('should return 404 for non-existent user ID', async () => {
      const updateUserDto = {
        name: 'Updated Name',
      };

      const nonExistentId = 999999;
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${nonExistentId}`)
        .send(updateUserDto)
        .expect(404);
    });

    it('should allow partial updates', async () => {
      const partialUpdateDto = {
        name: 'Partially Updated User',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdUserId}`)
        .send(partialUpdateDto)
        .expect(200);

      expect(response.body.name).toBe(partialUpdateDto.name);
      expect(response.body.email).toBe(uniqueEmail3); // Should remain unchanged
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete user (set isActive to false)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${createdUserId}`)
        .expect(204);

      // Verify user was soft deleted (isActive = false)
      const userInDb = await prismaService.user.findUnique({
        where: { id: createdUserId },
      });
      expect(userInDb).toBeTruthy();
      expect(userInDb!.isActive).toBe(false);

      // Verify user no longer appears in active users list
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(200);

      const deletedUser = response.body.data.find(
        (user: any) => user.id === createdUserId,
      );
      expect(deletedUser).toBeUndefined();
    });

    it('should return 404 when trying to access soft deleted user', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}`)
        .expect(404);
    });

    it('should return 404 when trying to delete non-existent user', async () => {
      const nonExistentId = 999999;
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${nonExistentId}`)
        .expect(404);
    });

    it('should return 404 when trying to delete already deleted user', async () => {
      // Try to delete the already soft-deleted user
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${createdUserId}`)
        .expect(404);
    });
  });

  describe('Complete User Lifecycle E2E', () => {
    it('should handle complete CRUD lifecycle', async () => {
      const lifecycleEmail = `lifecycle-${timestamp}@example.com`;
      let lifecycleUserId: number | undefined;

      try {
        // 1. CREATE - Create a new user
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/users')
          .send({
            name: 'Lifecycle Test User',
            email: lifecycleEmail,
            password: 'lifecyclepassword123',
          })
          .expect(201);

        lifecycleUserId = createResponse.body.id;
        expect(createResponse.body.email).toBe(lifecycleEmail);

        // 2. READ - Get the created user
        const readResponse = await request(app.getHttpServer())
          .get(`/api/v1/users/${lifecycleUserId}`)
          .expect(200);

        expect(readResponse.body.id).toBe(lifecycleUserId);
        expect(readResponse.body.name).toBe('Lifecycle Test User');

        // 3. READ ALL - Verify user appears in list
        const listResponse = await request(app.getHttpServer())
          .get('/api/v1/users')
          .expect(200);

        const userInList = listResponse.body.data.find(
          (user: any) => user.id === lifecycleUserId,
        );
        expect(userInList).toBeTruthy();

        // 4. UPDATE - Update the user
        const updateResponse = await request(app.getHttpServer())
          .patch(`/api/v1/users/${lifecycleUserId}`)
          .send({
            name: 'Updated Lifecycle User',
            password: 'newlifecyclepassword123',
          })
          .expect(200);

        expect(updateResponse.body.name).toBe('Updated Lifecycle User');

        // 5. DELETE - Soft delete the user
        await request(app.getHttpServer())
          .delete(`/api/v1/users/${lifecycleUserId}`)
          .expect(204);

        // 6. VERIFY DELETION - User should not be accessible
        await request(app.getHttpServer())
          .get(`/api/v1/users/${lifecycleUserId}`)
          .expect(404);

        // 7. VERIFY NOT IN LIST - User should not appear in active users list
        const finalListResponse = await request(app.getHttpServer())
          .get('/api/v1/users')
          .expect(200);

        const deletedUserInList = finalListResponse.body.data.find(
          (user: any) => user.id === lifecycleUserId,
        );
        expect(deletedUserInList).toBeUndefined();
      } finally {
        // Cleanup
        if (lifecycleUserId) {
          await prismaService.user
            .delete({
              where: { id: lifecycleUserId },
            })
            .catch(() => {}); // Ignore if already deleted
        }
      }
    });
  });

  describe('Data Validation and Security E2E', () => {
    it('should not expose sensitive data in any endpoint', async () => {
      // Test that password is never exposed in any response
      const testEmail = `security-${timestamp}@example.com`;
      let securityUserId: number | undefined;

      try {
        // Create user
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/users')
          .send({
            name: 'Security Test User',
            email: testEmail,
            password: 'securitypassword123',
          })
          .expect(201);

        securityUserId = createResponse.body.id;
        expect(createResponse.body.password).toBeUndefined();

        // Get single user
        const getResponse = await request(app.getHttpServer())
          .get(`/api/v1/users/${securityUserId}`)
          .expect(200);
        expect(getResponse.body.password).toBeUndefined();

        // Get all users
        const listResponse = await request(app.getHttpServer())
          .get('/api/v1/users')
          .expect(200);

        const securityUser = listResponse.body.data.find(
          (user: any) => user.id === securityUserId,
        );
        expect(securityUser.password).toBeUndefined();

        // Update user
        const updateResponse = await request(app.getHttpServer())
          .patch(`/api/v1/users/${securityUserId}`)
          .send({ name: 'Updated Security User' })
          .expect(200);
        expect(updateResponse.body.password).toBeUndefined();
      } finally {
        // Cleanup
        if (securityUserId) {
          await prismaService.user
            .delete({
              where: { id: securityUserId },
            })
            .catch(() => {});
        }
      }
    });
  });
});
