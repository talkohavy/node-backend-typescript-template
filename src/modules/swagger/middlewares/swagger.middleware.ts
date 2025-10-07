import express, { type Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import type { SwaggerService } from '../services/swagger.service';
import { API_URLS } from '../../../common/constants';

export class SwaggerMiddleware {
  private pathToSwaggerServeDir = '';

  constructor(
    private readonly app: Application,
    private readonly swaggerService: SwaggerService,
  ) {
    this.pathToSwaggerServeDir = path.join(process.cwd(), process.env.PATH_TO_SWAGGER_SERVE_DIR ?? '');
    this.swaggerService.generateSwaggerDocsFromConfigs(this.pathToSwaggerServeDir);
  }

  use() {
    // Step 1: serve the swagger website
    const swaggerServe = swaggerUi.serve;
    const topLevelSwaggerConfig = this.swaggerService.createTopLevelSwaggerConfig();
    const swaggerSetup = swaggerUi.setup(null, topLevelSwaggerConfig); // <--- or, swaggerUi.setup(swaggerDocs, swaggerExtraOptions)

    this.app.use(API_URLS.swagger, swaggerServe, swaggerSetup);

    // Step 2: serve all documentations
    this.app.use(express.static(this.pathToSwaggerServeDir));
  }
}
