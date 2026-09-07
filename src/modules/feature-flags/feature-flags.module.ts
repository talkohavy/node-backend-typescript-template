import { FeatureFlagsCrudController } from './controllers/feature-flags-crud';
import { FeatureFlagsEvaluateController } from './controllers/feature-flags-evaluate';
import { FeatureFlagsRepository } from './repositories/feature-flags';
import { DataTransformerService } from './services/data-transformer';
import { FeatureFlagsService } from './services/feature-flags';
import type { Application } from 'express';
import type { ModuleFactory } from '@src/lib/lucky-server';

export class FeatureFlagsModule implements ModuleFactory {
  private featureFlagsRepository!: FeatureFlagsRepository;
  private featureFlagsService!: FeatureFlagsService;
  private dataTransformerService!: DataTransformerService;

  constructor(private readonly app: Application) {}

  async init(): Promise<void> {
    const { kysely } = this.app;

    this.dataTransformerService = new DataTransformerService();
    this.featureFlagsRepository = new FeatureFlagsRepository(kysely, this.dataTransformerService);
    this.featureFlagsService = new FeatureFlagsService(this.featureFlagsRepository, this.dataTransformerService);

    if (process.env.IS_STANDALONE_MICRO_SERVICES) {
      this.attachControllers();
    }
  }

  private attachControllers() {
    const featureFlagsEvaluateController = new FeatureFlagsEvaluateController(this.app, this.featureFlagsService);
    const featureFlagsCrudController = new FeatureFlagsCrudController(this.app, this.featureFlagsService);

    featureFlagsEvaluateController.registerRoutes();
    featureFlagsCrudController.registerRoutes();
  }

  get services() {
    return {
      featureFlagsService: this.featureFlagsService,
    };
  }
}
