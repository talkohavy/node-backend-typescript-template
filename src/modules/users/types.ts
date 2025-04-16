export type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

export type CreateUserDto = {
  name: string;
};

export type UpdateUserDto = {
  name?: string;
  age?: number;
  email?: string;
};
