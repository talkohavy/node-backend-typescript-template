export type CreateUserDto = {
  email: string;
  hashedPassword: string;
  nickname: string;
  dateOfBirth: number | string;
};

export type UpdateUserDto = {
  email?: string;
  hashedPassword?: string;
  nickname?: string;
  dateOfBirth?: number | string;
};
