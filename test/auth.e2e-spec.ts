/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const ts = Date.now();
  const email = `auth-${ts}@example.com`;
  const password = 'InitialPass123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register, login, access profile, reset password and login with new password', async () => {
    // 1. Create user via API
    const createRes = await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Auth E2E',
        email,
        password,
      })
      .expect(201);

    const userId = createRes.body.id;

    // 2. Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    expect(loginRes.body).toHaveProperty('access_token');
    const token = loginRes.body.access_token;

    // 3. Access protected profile
    const profileRes = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body).toHaveProperty('id', userId);

    // 4. Request password reset
    const reqResetRes = await request(app.getHttpServer())
      .post('/auth/request-reset')
      .send({ email })
      .expect(201);

    const resetToken = reqResetRes.body.token;
    expect(resetToken).toBeDefined();

    // 5. Reset password
    const newPassword = 'NewPass456!';
    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({ token: resetToken, newPassword })
      .expect(201);

    // 6. Try login with old password -> should fail
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(401);

    // 7. Login with new password
    const loginRes2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: newPassword })
      .expect(201);

    const token2 = loginRes2.body.access_token;

    // 8. Logout (MVP behaviour)
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token2}`)
      .expect((res) => {
        if (![200, 201].includes(res.status)) {
          throw new Error(`Unexpected status code: ${res.status}`);
        }
      });

    // Cleanup: remove user directly from DB (optional)
    await prisma.user.delete({ where: { id: userId } });
  }, 20000);
});
