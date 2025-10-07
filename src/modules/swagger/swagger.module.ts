import type { Application } from 'express';
import { ModuleFactory } from '../../lib/lucky-server';
import { UsersSwaggerConfig } from './configs/users.swagger.config';
import { SwaggerMiddleware } from './middlewares';
import { SwaggerService } from './services/swagger.service';

export class SwaggerModule implements ModuleFactory {
  private static instance: SwaggerModule;
  private swaggerService!: SwaggerService;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): SwaggerModule {
    if (!SwaggerModule.instance) {
      SwaggerModule.instance = new SwaggerModule();
    }
    return SwaggerModule.instance;
  }

  protected initializeModule(): void {
    const usersSwaggerConfig = new UsersSwaggerConfig();

    this.swaggerService = new SwaggerService([usersSwaggerConfig]);
  }

  attachController(app: Application): void {
    const swaggerMiddleware = new SwaggerMiddleware(app, this.swaggerService);

    swaggerMiddleware.use();
  }
}
