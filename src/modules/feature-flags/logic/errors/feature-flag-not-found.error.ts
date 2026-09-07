import { BaseError } from '@src/core/errors/BaseError';

export class FeatureFlagNotFoundError extends BaseError {
  constructor(key: string) {
    super({
      name: FeatureFlagNotFoundError.name,
      message: `Feature flag with key "${key}" not found`,
    });
  }
}
