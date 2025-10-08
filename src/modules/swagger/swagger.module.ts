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
    const usersSwaggerConfig = new UsersSwaggerConfig();
    const booksSwaggerConfig = new BooksSwaggerConfig();

    this.swaggerService = new SwaggerService([usersSwaggerConfig, booksSwaggerConfig]);
  }

  attachController(app: Application): void {
    const swaggerMiddleware = new SwaggerMiddleware(app, this.swaggerService);

    swaggerMiddleware.use();
  }
}
