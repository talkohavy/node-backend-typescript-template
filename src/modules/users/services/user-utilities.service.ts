import { UserNotFoundError } from '../logic/users.errors';
import { UsersPostgresRepository } from '../repositories/users.postgres.repository';
import { DatabaseUser } from '../types';

export class UserUtilitiesService {
  constructor(private readonly usersRepository: UsersPostgresRepository) {}

  async getUserByEmail(email: string): Promise<DatabaseUser> {
    const fields = ['id', 'email', 'name', 'age'];
    const user = await this.usersRepository.getUserByEmail(email, { fields });

    if (!user) throw new UserNotFoundError(email);

    return user;
  }
}
