export type DatabaseUser = {
  _id: number;
  email: string;
  hashedPassword: string;
  name?: string;
  age?: number;
};

// export type UserResponseDto = Omit<User, 'password'>;
