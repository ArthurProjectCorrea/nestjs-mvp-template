import geoip from 'geoip-lite';

interface GeoInfo {
  country: string;
  region: string;
  city: string;
}

export function getRegionFromIp(ip: string): GeoInfo | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const info = geoip.lookup(ip);
    if (!info) return null;
    // pode retornar country / region / city
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      country: (info as any).country || '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      region: (info as any).region || '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      city: (info as any).city || '',
    };
  } catch {
    return null;
  }
}
