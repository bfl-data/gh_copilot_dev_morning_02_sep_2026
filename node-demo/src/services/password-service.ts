import bcrypt from 'bcrypt';

const saltRounds = 12;

/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param password - Plaintext password to hash.
 * @returns A bcrypt password hash.
 * @throws {Error} When bcrypt cannot create the hash.
 *
 * @example
 * const passwordHash = await hashPassword('correct-horse-battery-staple');
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verifies a plaintext password against a bcrypt hash.
 *
 * @param password - Plaintext password to verify.
 * @param passwordHash - Bcrypt hash stored for the user.
 * @returns Whether the password matches the hash.
 * @throws {Error} When bcrypt cannot verify the password.
 *
 * @example
 * const isValid = await verifyPassword('correct-horse-battery-staple', passwordHash);
 */
export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}