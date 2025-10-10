import { Module, Global } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { RedisService } from './common/redis/redis.service';
import { CleanupService } from './common/cleanup/cleanup.service';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: Number(process.env.RATE_LIMIT_TTL || 900) * 1000, // convert to ms
            limit: Number(process.env.RATE_LIMIT_MAX || 10),
          },
        ],
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RedisService, CleanupService],
  exports: [PrismaService, RedisService],
})
export class AppModule {}
