import { validatePassword } from './password-policy';

describe('Password Policy Utils', () => {
  describe('validatePassword', () => {
    beforeEach(() => {
      // Set default environment variables for tests
      process.env.PASSWORD_MIN_LENGTH = '8';
      process.env.PASSWORD_REQUIRE_UPPER = 'true';
      process.env.PASSWORD_REQUIRE_LOWER = 'true';
      process.env.PASSWORD_REQUIRE_NUMBER = 'true';
      process.env.PASSWORD_REQUIRE_SYMBOL = 'true';
    });

    afterEach(() => {
      // Clean up environment variables
      delete process.env.PASSWORD_MIN_LENGTH;
      delete process.env.PASSWORD_REQUIRE_UPPER;
      delete process.env.PASSWORD_REQUIRE_LOWER;
      delete process.env.PASSWORD_REQUIRE_NUMBER;
      delete process.env.PASSWORD_REQUIRE_SYMBOL;
    });

    it('should validate strong password correctly', () => {
      const result = validatePassword('StrongPass123!');
      expect(result).toBeNull(); // null means valid
    });

    it('should reject password too short', () => {
      process.env.PASSWORD_MIN_LENGTH = '10';
      const result = validatePassword('Short1!');
      expect(result).toBe('minimum length');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('weakpass123!');
      expect(result).toBe('uppercase missing');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('WEAKPASS123!');
      expect(result).toBe('lowercase missing');
    });

    it('should reject password without number', () => {
      const result = validatePassword('WeakPass!');
      expect(result).toBe('number missing');
    });

    it('should reject password without symbol', () => {
      const result = validatePassword('WeakPass123');
      expect(result).toBe('symbol missing');
    });

    it('should handle disabled requirements', () => {
      process.env.PASSWORD_REQUIRE_UPPER = 'false';
      process.env.PASSWORD_REQUIRE_SYMBOL = 'false';

      const result = validatePassword('weakpass123');
      expect(result).toBeNull(); // Should pass with relaxed requirements
    });

    it('should handle minimum length requirement', () => {
      process.env.PASSWORD_MIN_LENGTH = '12';

      expect(validatePassword('Short1!')).toBe('minimum length');
      expect(validatePassword('LongEnoughPass123!')).toBeNull();
    });

    it('should handle edge cases', () => {
      // Empty password
      expect(validatePassword('')).toBe('minimum length');

      // Only symbols
      expect(validatePassword('!@#$%^&*()')).toBe('uppercase missing');

      // Very long password
      const longPassword = 'A'.repeat(99) + 'a1!';
      expect(validatePassword(longPassword)).toBeNull();

      // Unicode characters
      expect(validatePassword('Pássword123!')).toBeNull();
    });

    it('should validate complex requirements combinations', () => {
      // Test all requirements enabled
      expect(validatePassword('ValidPass123!')).toBeNull();

      // Test missing multiple requirements
      process.env.PASSWORD_REQUIRE_UPPER = 'false';
      expect(validatePassword('validpass123!')).toBeNull(); // Should still pass

      process.env.PASSWORD_REQUIRE_LOWER = 'false';
      expect(validatePassword('VALIDPASS123!')).toBeNull(); // Should still pass
    });
  });
});
