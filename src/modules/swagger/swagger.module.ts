import type { Application } from 'express';
import { IS_STANDALONE_MICRO_SERVICES } from '../../common/constants';
import { BooksSwaggerConfig } from './configs/books/books.swagger.config';
import { UsersSwaggerConfig } from './configs/users/users.swagger.config';
import { SwaggerMiddleware } from './middlewares';
import { SwaggerService } from './services/swagger.service';

export class SwaggerModule {
  private swaggerService!: SwaggerService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.swaggerService = new SwaggerService([UsersSwaggerConfig, BooksSwaggerConfig]);

    // Only attach routes if running as a standalone micro-service
    if (IS_STANDALONE_MICRO_SERVICES) {
      this.attachControllers(this.app);
    }
  }

  private attachControllers(app: Application): void {
    const swaggerMiddleware = new SwaggerMiddleware(app, this.swaggerService);

    swaggerMiddleware.use();
  }
}
