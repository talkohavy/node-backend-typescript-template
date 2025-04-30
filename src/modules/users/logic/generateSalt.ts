import { randomBytes } from 'crypto';

/**
 * @description
 * A hash by itself isn't quite sufficient enough for storing passwords in a database,
 * because the fact that a hashing function always returns the same value is also a problem when it comes to passwords.
 * Especially when you let stupid humans come up with them. Which brings the need for salt.
 * A "salt" is just a random value that's added to the password before it's hashed, and therefore making it much harder to guess.
 * In node, we can hash a password with salt by importing scryptSync & the randomBytes function from within crypto.
 */
export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}
