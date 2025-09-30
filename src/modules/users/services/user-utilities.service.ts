import { UserNotFoundError } from '../logic/users.errors';
import { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import { FieldScreeningService } from '../services/field-screening.service';
import { DatabaseUser } from '../types';

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
