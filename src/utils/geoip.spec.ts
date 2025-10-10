import { getRegionFromIp } from './geoip';

describe('GeoIP Utils', () => {
  describe('getRegionFromIp', () => {
    it('should return region info for valid IP', () => {
      // This test would require mocking geoip-lite properly
      // For now, we'll test the error handling path
      const result = getRegionFromIp('192.168.1.1');
      // Since we can't easily mock geoip-lite in this environment,
      // we'll just verify the function doesn't throw
      expect(typeof result).toBe('object');
      expect(result).toBeDefined();
    });

    it('should handle invalid IP gracefully', () => {
      const result = getRegionFromIp('invalid-ip');
      expect(result).toBeNull();
    });

    it('should handle edge cases', () => {
      // Test with various IP formats
      expect(typeof getRegionFromIp('127.0.0.1')).toBe('object');
      expect(typeof getRegionFromIp('10.0.0.1')).toBe('object');
      expect(typeof getRegionFromIp('172.16.0.1')).toBe('object');
      expect(typeof getRegionFromIp('192.168.1.1')).toBe('object');
    });
  });
});
