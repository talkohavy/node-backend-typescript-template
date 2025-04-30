import { User, UserResponseDto } from '../types';

export function sanitizeUser(user: User | null): UserResponseDto | null {
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: removePassword, ...sanitizedUser } = user;
  return sanitizedUser;
}

export const sanitizeUsers = (users: User[]): UserResponseDto[] => {
  return users.map((user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: removePassword, ...sanitizedUser } = user;
    return sanitizedUser;
  });
};
