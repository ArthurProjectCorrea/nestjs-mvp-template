import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens() {
    const now = new Date();
    // mark expired tokens as revoked
    const expired = await this.prisma.token.findMany({
      where: { expiresAt: { lt: now }, isRevoked: false },
    });
    for (const t of expired) {
      await this.prisma.token.update({
        where: { id: t.id },
        data: { isRevoked: true },
      });
      // add to redis blacklist with small TTL (safety)
      const ttl = 60 * 60 * 24; // 1 day fallback
      await this.redis
        .getClient()
        .setex(`bl:refresh:${t.refreshTokenHash}`, ttl, '1');
      await this.redis.getClient().zrem(`sessions:${t.userId}`, String(t.id));
      await this.redis.getClient().del(`session:token:${t.id}`);
    }
    this.logger.log(`Cleaned ${expired.length} expired tokens`);
  }

  // optionally clean old audit logs / password history beyond retention
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldAuditLogs() {
    const retentionDays = Number(process.env.AUDIT_RETENTION_DAYS || 365);
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    await this.prisma.auditLog.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
  }
}
