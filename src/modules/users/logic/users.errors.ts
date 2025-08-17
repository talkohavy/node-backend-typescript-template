import { BaseError } from '../../../lib/Errors/BaseError';

export class UserNotFoundError extends BaseError {
  constructor(userId: string) {
    super({ name: UserNotFoundError.name, message: `User with id ${userId} not found` });
  }
}

export class WrongPasswordError extends BaseError {
  constructor() {
    super({ name: WrongPasswordError.name, message: 'Wrong password' });
  }
}
