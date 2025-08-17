import { scrypt } from 'crypto';

type GenerateHashedPasswordProps = {
  rawPassword: string;
  salt: string;
};

/**
 * @description
 * In node, we can hash a password with salt by importing scrypt from within crypto & some salt.
 * We will then use scrypt to hash both the salt and the password.
 *
 * This function generates a hashed password from a raw password (user input) and a salt.
 * We provide scrypt with the original raw-password and salt, and provide a key length which is recommended to be 64.
 * Without getting into more details, scrypt makes it more computational intensive to crack using brute force,
 * and it's actually been used as proof of work algorithms used in cryptocurrency mining.
 * Now in your db you need to store both the salt and the hashed password.
 */
export async function generateHashedPassword(props: GenerateHashedPasswordProps): Promise<string> {
  const { rawPassword, salt } = props;

  return new Promise((resolve, reject) => {
    scrypt(rawPassword, salt, 64, (error, hashedPassword) => {
      if (error) return reject(error);
      resolve(hashedPassword.toString('hex'));
    });
  });
}
