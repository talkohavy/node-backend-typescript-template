import { BaseError } from '@src/core/errors/BaseError';

export class FeatureFlagAlreadyExistsError extends BaseError {
  constructor(key: string) {
    super({
      name: FeatureFlagAlreadyExistsError.name,
      message: `Feature flag with key "${key}" already exists`,
    });
  }
}
