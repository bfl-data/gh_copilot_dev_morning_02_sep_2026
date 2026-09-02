import { describe, expect, it, vi } from 'vitest';
import { hashPassword, verifyPassword } from './password-service.js';

const bcryptMocks = vi.hoisted(() => ({
  hash: vi.fn<(password: string, saltRounds: number) => Promise<string>>(),
  compare: vi.fn<(password: string, passwordHash: string) => Promise<boolean>>(),
}));

vi.mock('bcrypt', () => ({
  default: bcryptMocks,
}));

describe('password service', () => {
  it('hashes passwords with the configured bcrypt work factor', async () => {
    // Arrange
    bcryptMocks.hash.mockResolvedValue('$2b$12$hashed-password');

    // Act
    const passwordHash = await hashPassword('correct-horse-battery-staple');

    // Assert
    expect(passwordHash).toBe('$2b$12$hashed-password');
    expect(bcryptMocks.hash).toHaveBeenCalledWith(
      'correct-horse-battery-staple',
      12,
    );
  });

  it('returns bcrypt password verification results', async () => {
    // Arrange
    bcryptMocks.compare.mockResolvedValue(false);

    // Act
    const isValid = await verifyPassword('incorrect-password', '$2b$12$hashed-password');

    // Assert
    expect(isValid).toBe(false);
    expect(bcryptMocks.compare).toHaveBeenCalledWith(
      'incorrect-password',
      '$2b$12$hashed-password',
    );
  });
});