import { User, UserCreateDto, UserUpdateDto } from './types.js';

const database: Array<User> = [];

export class UsersService {
  constructor() {}

  async getUsers(): Promise<Array<User>> {
    return database;
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = database.find((user) => user.id === parseInt(userId));

    if (!user) return null;

    return user;
  }

  async createUser(user: UserCreateDto) {
    const users = await this.getUsers();

    const newUser = {
      id: users.length + 1,
      name: user.name,
      age: Math.floor(Math.random() * 100),
      email: `${user.name.toLowerCase()}@example.com`,
    };

    users.push(newUser);

    return newUser;
  }

  async updateUser(userId: string, user: UserUpdateDto): Promise<User | null> {
    const parsedId = parseInt(userId);
    const userIndex = database.findIndex((user) => user.id === parsedId);

    if (userIndex > -1) return null;

    database[userIndex] = { ...database[userIndex], ...user } as User;
    return database[userIndex];
  }

  async deleteUser(userId: string) {
    const parsedId = parseInt(userId);
    const userIndex = database.findIndex((user) => user.id === parsedId);

    if (userIndex > -1) return null;

    database.splice(userIndex, 1);

    return { message: 'User deleted successfully' };
  }
}
