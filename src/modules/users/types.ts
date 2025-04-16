export type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

export type UserCreateDto = {
  name: string;
};

export type UserUpdateDto = {
  name?: string;
  age?: number;
  email?: string;
};
