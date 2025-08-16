export type CreateUserDto = {
  email: string;
  password: string;
  name: string;
  age: number;
};

export type UpdateUserDto = {
  email?: string;
  password?: string;
  name?: string;
  age?: number;
};
