import type { Application } from 'express';
import { BooksSwaggerConfig } from './configs/books/books.swagger.config';
import { UsersSwaggerConfig } from './configs/users/users.swagger.config';
import { SwaggerMiddleware } from './middlewares';
import { SwaggerService } from './services/swagger.service';

export class SwaggerModule {
  private static instance: SwaggerModule;
  private swaggerService!: SwaggerService;

  static getInstance(app?: any): SwaggerModule {
    if (!SwaggerModule.instance) {
      SwaggerModule.instance = new SwaggerModule(app);
    }
    return SwaggerModule.instance;
  }

  private constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.swaggerService = new SwaggerService([UsersSwaggerConfig, BooksSwaggerConfig]);

    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const swaggerMiddleware = new SwaggerMiddleware(app, this.swaggerService);

    swaggerMiddleware.use();
  }
}
