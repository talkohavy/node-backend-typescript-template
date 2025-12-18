import express, { type Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import type { SwaggerService } from '../services/swagger.service';
import { API_URLS } from '../../../common/constants';

export class SwaggerController {
  private pathToSwaggerServeDir = '';

  constructor(
    private readonly app: Application,
    private readonly swaggerService: SwaggerService,
  ) {
    this.pathToSwaggerServeDir = path.join(process.cwd(), process.env.PATH_TO_SWAGGER_SERVE_DIR ?? '');
    this.swaggerService.generateSwaggerDocsFromConfigs(this.pathToSwaggerServeDir);
  }

  private getDocsWebsite() {
    const swaggerServe = swaggerUi.serve;
    const topLevelSwaggerConfig = this.swaggerService.createTopLevelSwaggerConfig();
    const swaggerSetup = swaggerUi.setup(null, topLevelSwaggerConfig); // <--- or, swaggerUi.setup(swaggerDocs, swaggerExtraOptions)

    this.app.get(API_URLS.swagger, swaggerServe, swaggerSetup);
  }

  private serveSwaggerConfigs() {
    this.app.use(express.static(this.pathToSwaggerServeDir));
  }

  registerRoutes() {
    this.getDocsWebsite();
    this.serveSwaggerConfigs();
  }
}
