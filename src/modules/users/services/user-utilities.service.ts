import type { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import type { FieldScreeningService } from '../services/field-screening.service';
import type { DatabaseUser } from '../types';
import { UserNotFoundError } from '../logic/users.errors';

export class UserUtilitiesService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly fieldScreeningService: FieldScreeningService,
  ) {}

  async getUserByEmail(email: string): Promise<DatabaseUser> {
    const nonSensitiveFields = this.fieldScreeningService.getNonSensitiveFields();
    const fields = [...nonSensitiveFields, 'hashed_password'];

    const user = await this.usersRepository.getUserByEmail(email, { fields });

    if (!user) throw new UserNotFoundError(email);

    return user;
  }
}
