import { timingSafeEqual } from 'node:crypto';
import { generateHashedPassword } from '../logic/generateHashedPassword';
import { generateSalt } from '../logic/generateSalt';
import { UserAlreadyExistsError, UserNotFoundError, WrongPasswordError } from '../logic/users.errors';
import { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import { DatabaseUser } from '../types';
import { CreateUserDto, UpdateUserDto } from './interfaces/users.service.interface';

export class UsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async getUsers(): Promise<Array<DatabaseUser>> {
    return this.usersRepository.getUsers();
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) throw new UserNotFoundError(userId);

    return user;
  }

  async createUser(userData: CreateUserDto): Promise<DatabaseUser> {
    const { email, password: rawPassword, name, age } = userData;

    const existingUser = await this.usersRepository.getUserByEmail(email);

    if (existingUser) throw new UserAlreadyExistsError(email);

    const salt = generateSalt();
    const hashedPassword = await generateHashedPassword({ rawPassword, salt });

    const createdUser: Omit<DatabaseUser, 'id'> = {
      email,
      password: `${salt}:${hashedPassword}`,
      name,
      age,
    };

    const newUser = await this.usersRepository.createUser(createdUser);

    return newUser;
  }

  async login(email: string, password: string): Promise<DatabaseUser> {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new UserNotFoundError(email);

    const isPasswordValid = await this.getIsPasswordValid(user, password);

    if (!isPasswordValid) throw new WrongPasswordError();

    return user;
  }

  async updateUser(userId: string, user: UpdateUserDto): Promise<DatabaseUser> {
    const existingUser = await this.usersRepository.getUserById(userId);

    if (!existingUser) throw new UserNotFoundError(userId);

    const updatedUser = { ...existingUser, ...user } as DatabaseUser;

    await this.usersRepository.updateUserById(userId, updatedUser);

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    try {
      await this.usersRepository.deleteUserById(userId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  /**
   * @description
   * A time-attack is where a hacker measures the amount of time it takes to perform an operation, to obtain information about the value.
   * The timingSafeEqual() function prevents that type of attack. It is used to determine whether two variables are equal,
   * without exposing timing information that may allow an attacker to guess one of the values.
   */
  private async getIsPasswordValid(user: DatabaseUser, rawPassword: string): Promise<boolean> {
    const [salt, storedHashedPassword] = user.password.split(':') as [string, string];
    const generatedHashedPassword = await generateHashedPassword({ rawPassword, salt });

    const isMatch = timingSafeEqual(Buffer.from(storedHashedPassword), Buffer.from(generatedHashedPassword));

    return isMatch;
  }
}
