import { API_PATHS, StatusCodes } from '@src/common/constants';
import { NotFoundError } from '@src/core/errors';
import { joiBodyMiddleware } from '@src/middlewares/joi-body.middleware';
import { FeatureFlagNotFoundError } from '@src/modules/feature-flags';
import { evaluateFeatureFlagsSchema } from './dto/evaluateFeatureFlagsSchema.dto';
import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '@src/lib/lucky-server';
import type { IFeatureFlagsAdapter } from '../../adapters/feature-flags.adapter.interface';

export class FeatureFlagsEvaluateController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly featureFlagsAdapter: IFeatureFlagsAdapter,
  ) {}

  registerRoutes() {
    this.evaluateFeatureFlags();
    this.isFeatureFlagEnabled();
  }

  private evaluateFeatureFlags() {
    this.app.post(
      API_PATHS.evaluateFeatureFlags,
      joiBodyMiddleware(evaluateFeatureFlagsSchema),
      async (req: Request, res: Response) => {
        const { body } = req;

        this.app.logger.info(`POST ${API_PATHS.evaluateFeatureFlags} - evaluating feature flags`);

        const result = await this.featureFlagsAdapter.evaluateFeatureFlags(body.keys);

        res.json(result);
      },
    );
  }

  private isFeatureFlagEnabled() {
    this.app.get(API_PATHS.isFeatureFlagEnabled, async (req: Request, res: Response) => {
      try {
        const { params } = req;

        this.app.logger.info(`GET ${API_PATHS.isFeatureFlagEnabled} - checking if feature flag is enabled`);

        const key = params.key!;
        const result = await this.featureFlagsAdapter.getFeatureFlagByKey(key);

        res.json(result);
      } catch (error) {
        if (error instanceof FeatureFlagNotFoundError || error.statusCode === StatusCodes.NOT_FOUND) {
          throw new NotFoundError(error.message);
        }

        throw error;
      }
    });
  }
}
