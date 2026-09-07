import { API_PATHS, StatusCodes } from '@src/common/constants';
import { BadRequestError, NotFoundError } from '@src/core/errors';
import { joiBodyMiddleware } from '@src/middlewares/joi-body.middleware';
import { FeatureFlagAlreadyExistsError, FeatureFlagNotFoundError } from '../../logic/errors';
import { createFeatureFlagSchema } from './dto/create-feature-flag.dto';
import { updateFeatureFlagSchema } from './dto/update-feature-flag.dto';
import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '@src/lib/lucky-server';
import type { FeatureFlagsService } from '../../services/feature-flags';

export class FeatureFlagsCrudController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  registerRoutes() {
    this.createFeatureFlag();
    this.getFeatureFlags();
    this.getFeatureFlagByKey();
    this.updateFeatureFlagByKey();
    this.deleteFeatureFlagByKey();
  }

  private createFeatureFlag() {
    this.app.post(
      API_PATHS.featureFlags,
      joiBodyMiddleware(createFeatureFlagSchema),
      async (req: Request, res: Response) => {
        try {
          const { body } = req;

          this.app.logger.info(`POST ${API_PATHS.featureFlags} - creating feature flag`);

          const featureFlag = await this.featureFlagsService.createFeatureFlag(body);

          res.status(StatusCodes.CREATED).json(featureFlag);
        } catch (error) {
          if (error instanceof FeatureFlagAlreadyExistsError) {
            throw new BadRequestError(error.message, { statusCode: StatusCodes.CONFLICT });
          }

          throw error;
        }
      },
    );
  }

  private getFeatureFlags() {
    this.app.get(API_PATHS.featureFlags, async (_req: Request, res: Response) => {
      this.app.logger.info(`GET ${API_PATHS.featureFlags} - listing feature flags`);

      const featureFlags = await this.featureFlagsService.getFeatureFlags();

      res.json(featureFlags);
    });
  }

  private getFeatureFlagByKey() {
    this.app.get(API_PATHS.featureFlagByKey, async (req: Request, res: Response) => {
      try {
        const { params } = req;

        this.app.logger.info(`GET ${API_PATHS.featureFlagByKey} - fetching feature flag by key`);

        const key = params.key!;
        const featureFlag = await this.featureFlagsService.getFeatureFlagByKey(key);

        res.json(featureFlag);
      } catch (error) {
        if (error instanceof FeatureFlagNotFoundError) {
          throw new NotFoundError(error.message);
        }

        throw error;
      }
    });
  }

  private updateFeatureFlagByKey() {
    this.app.patch(
      API_PATHS.featureFlagByKey,
      joiBodyMiddleware(updateFeatureFlagSchema),
      async (req: Request, res: Response) => {
        try {
          const { body, params } = req;

          this.app.logger.info(`PATCH ${API_PATHS.featureFlagByKey} - updating feature flag`);

          const key = params.key!;
          const featureFlag = await this.featureFlagsService.updateFeatureFlag({ key, data: body });

          res.json(featureFlag);
        } catch (error) {
          if (error instanceof FeatureFlagNotFoundError) {
            throw new NotFoundError(error.message);
          }

          throw error;
        }
      },
    );
  }

  private deleteFeatureFlagByKey() {
    this.app.delete(API_PATHS.featureFlagByKey, async (req: Request, res: Response) => {
      try {
        const { params } = req;

        this.app.logger.info(`DELETE ${API_PATHS.featureFlagByKey} - deleting feature flag`);

        const key = params.key!;
        await this.featureFlagsService.deleteFeatureFlagByKey(key);

        const result = { success: true };

        res.json(result);
      } catch (error) {
        if (error instanceof FeatureFlagNotFoundError) {
          throw new NotFoundError(error.message);
        }

        throw error;
      }
    });
  }
}
