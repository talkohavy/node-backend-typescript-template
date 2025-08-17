import { UserNotFoundError } from '../logic/users.errors';
import { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import { DatabaseUser } from '../types';

export class UserUtilitiesService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async getUserByEmail(email: string): Promise<DatabaseUser> {
    const fields = ['id', 'email', 'nickname', 'hashedPassword'];
    const user = await this.usersRepository.getUserByEmail(email, { fields });

    if (!user) throw new UserNotFoundError(email);

    return user;
  }
}
