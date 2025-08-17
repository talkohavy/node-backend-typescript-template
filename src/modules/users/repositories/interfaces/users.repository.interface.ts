export type GetUserByEmailOptions = {
  fields?: Array<string>;
};

export type CreateUserDto = {
  email: string;
  password: string;
  name?: string;
  age?: number;
};

export type GetUsersProps = {
  filter: any;
  fields: any;
  options: {
    limit: number;
    skip: number;
    sort: Record<string, number>;
  };
};

export type GetUserByIdOptions = any;

export type UpdateUserDto = {
  name?: string;
  age?: number;
  email?: string;
};
