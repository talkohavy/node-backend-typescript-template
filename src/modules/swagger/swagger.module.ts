import type { Application } from 'express';
import { BooksSwaggerConfig } from './configs/books/books.swagger.config';
import { UsersSwaggerConfig } from './configs/users/users.swagger.config';
import { SwaggerController } from './controllers';
import { SwaggerService } from './services/swagger.service';

/**
 * Docs can be found under the `/api/docs` route.
 */
export class SwaggerModule {
  private swaggerService!: SwaggerService;

  constructor(private readonly app: Application) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.swaggerService = new SwaggerService([UsersSwaggerConfig, BooksSwaggerConfig]);

    this.attachControllers(this.app);
  }

  private attachControllers(app: Application): void {
    const swaggerMiddleware = new SwaggerController(app, this.swaggerService);

    swaggerMiddleware.registerRoutes();
  }

  get services() {
    return {
      swaggerService: this.swaggerService,
    };
  }
}
