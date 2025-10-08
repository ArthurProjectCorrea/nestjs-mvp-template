import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: PrismaClient,
      useExisting: PrismaService,
    },
  ],
})
export class AppModule {}
