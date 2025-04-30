export type User = {
  id: number;
  email: string;
  password: string;
  name?: string;
  age?: number;
};

export type CreateUserDto = {
  email: string;
  password: string;
  name?: string;
  age?: number;
};

export type UpdateUserDto = {
  name?: string;
  age?: number;
  email?: string;
};

export type UserResponseDto = Omit<User, 'password'>;
