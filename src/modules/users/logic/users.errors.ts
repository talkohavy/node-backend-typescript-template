import { BaseError } from '../../../lib/Errors/BaseError';

export class UserAlreadyExistsError extends BaseError {
  constructor(email: string) {
    super({ name: UserAlreadyExistsError.name, message: `User with email ${email} already exists` });
  }
}

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
