import type { CreateUserDto } from '../../services/interfaces/users.service.interface';
import type { DatabaseUser } from '../../types';

export function createNewUserPayload(body: CreateUserDto) {
  const createdUserValues: Omit<DatabaseUser, 'id'> = {
    email: body.email,
    nickname: body.nickname,
    date_of_birth: Number(body.dateOfBirth),
    hashed_password: body.password,
  };

  return createdUserValues;
}
