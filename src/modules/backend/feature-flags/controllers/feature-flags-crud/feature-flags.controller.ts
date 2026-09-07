import { API_PATHS, StatusCodes } from '@src/common/constants';
import { BadRequestError, NotFoundError } from '@src/core/errors';
import { joiBodyMiddleware } from '@src/middlewares/joi-body.middleware';
import { FeatureFlagAlreadyExistsError, FeatureFlagNotFoundError } from '@src/modules/feature-flags';
import { createFeatureFlagSchema } from './dto/create-feature-flag.dto';
import { updateFeatureFlagSchema } from './dto/update-feature-flag.dto';
import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '@src/lib/lucky-server';
import type { IFeatureFlagsAdapter } from '../../adapters/feature-flags.adapter.interface';

export class FeatureFlagsController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly featureFlagsAdapter: IFeatureFlagsAdapter,
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

          const featureFlag = await this.featureFlagsAdapter.createFeatureFlag(body);

          res.status(StatusCodes.CREATED).json(featureFlag);
        } catch (error) {
          if (error instanceof FeatureFlagAlreadyExistsError || error.statusCode === StatusCodes.CONFLICT) {
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

      const featureFlags = await this.featureFlagsAdapter.getFeatureFlags();

      res.json(featureFlags);
    });
  }

  private getFeatureFlagByKey() {
    this.app.get(API_PATHS.featureFlagByKey, async (req: Request, res: Response) => {
      try {
        const { params } = req;

        this.app.logger.info(`GET ${API_PATHS.featureFlagByKey} - fetching feature flag by key`);

        const key = params.key!;
        const featureFlag = await this.featureFlagsAdapter.getFeatureFlagByKey(key);

        res.json(featureFlag);
      } catch (error) {
        if (error instanceof FeatureFlagNotFoundError || error.statusCode === StatusCodes.NOT_FOUND) {
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
          const featureFlag = await this.featureFlagsAdapter.updateFeatureFlag({ key, data: body });

          res.json(featureFlag);
        } catch (error) {
          if (error instanceof FeatureFlagNotFoundError || error.statusCode === StatusCodes.NOT_FOUND) {
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
        const result = await this.featureFlagsAdapter.deleteFeatureFlagByKey(key);

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
