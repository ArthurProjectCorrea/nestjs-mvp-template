import * as crypto from 'crypto';

const KEY = process.env.REFRESH_SECRET || 'fallback';
export function hashToken(token: string) {
  return crypto.createHmac('sha256', KEY).update(token).digest('hex');
}
