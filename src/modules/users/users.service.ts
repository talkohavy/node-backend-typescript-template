import { timingSafeEqual } from 'node:crypto';
import { generateHashedPassword } from './logic/generateHashedPassword';
import { generateSalt } from './logic/generateSalt';
import { UserAlreadyExistsError, UserNotFoundError, WrongPasswordError } from './logic/users.errors';
import { User, CreateUserDto, UpdateUserDto } from './types';

const database: Array<User> = [];

export class UsersService {
  constructor() {}

  async getUsers(): Promise<Array<User>> {
    return database;
  }

  async getUserById(userId: string): Promise<User> {
    const user = database.find((user) => user.id === parseInt(userId));

    if (!user) throw new UserNotFoundError(userId);

    return user;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const { email, password: rawPassword, name, age } = userData;

    const existingUser = database.find((user) => user.email === email);
    if (existingUser) throw new UserAlreadyExistsError(email);

    const salt = generateSalt();
    const hashedPassword = await generateHashedPassword({ rawPassword, salt });

    const createdUser: User = {
      id: database.length + 1,
      email,
      password: `${salt}:${hashedPassword}`,
      name,
      age,
    };

    database.push(createdUser);

    return createdUser;
  }

  async login(email: string, password: string): Promise<User> {
    const user = database.find((user) => user.email === email);

    if (!user) throw new UserNotFoundError(email);

    const isPasswordValid = await this.getIsPasswordValid(user, password);

    if (!isPasswordValid) throw new WrongPasswordError();

    return user;
  }

  async updateUser(userId: string, user: UpdateUserDto): Promise<User> {
    const parsedId = parseInt(userId);
    const userIndex = database.findIndex((user) => user.id === parsedId);

    if (userIndex === -1) throw new UserNotFoundError(userId);

    const updatedUser = { ...database[userIndex], ...user } as User;
    database[userIndex] = updatedUser;

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<Record<string, never>> {
    const parsedId = parseInt(userId);
    const userIndex = database.findIndex((user) => user.id === parsedId);

    if (userIndex === -1) throw new UserNotFoundError(userId);

    database.splice(userIndex, 1);

    return {};
  }

  /**
   * @description
   * A time-attack is where a hacker measures the amount of time it takes to perform an operation, to obtain information about the value.
   * The timingSafeEqual() function prevents that type of attack. It is used to determine whether two variables are equal,
   * without exposing timing information that may allow an attacker to guess one of the values.
   */
  private async getIsPasswordValid(user: User, rawPassword: string): Promise<boolean> {
    const [salt, storedHashedPassword] = user.password.split(':') as [string, string];
    const generatedHashedPassword = await generateHashedPassword({ rawPassword, salt });

    const isMatch = timingSafeEqual(Buffer.from(storedHashedPassword), Buffer.from(generatedHashedPassword));

    return isMatch;
  }
}
