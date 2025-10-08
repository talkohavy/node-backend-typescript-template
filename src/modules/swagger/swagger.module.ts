import type { Application } from 'express';
import type { ModuleFactory } from '../../lib/lucky-server';
import { BooksSwaggerConfig } from './configs/books/books.swagger.config';
import { UsersSwaggerConfig } from './configs/users/users.swagger.config';
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
    this.swaggerService = new SwaggerService([UsersSwaggerConfig, BooksSwaggerConfig]);
  }

  attachController(app: Application): void {
    const swaggerMiddleware = new SwaggerMiddleware(app, this.swaggerService);

    swaggerMiddleware.use();
  }
}
