export type DatabaseUser = {
  id: number;
  email: string;
  password: string;
  name?: string;
  age?: number;
};

// export type UserResponseDto = Omit<User, 'password'>;
