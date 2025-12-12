import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { TokenGenerationService } from '../services/token-generation.service';
import { API_URLS } from '../../../common/constants';
import { logger } from '../../../core';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { createTokensSchema } from './dto/create-tokens.dto';

export class TokenGenerationController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  private createTokens() {
    this.app.post(API_URLS.createTokens, joiBodyMiddleware(createTokensSchema), async (req: Request, res: Response) => {
      logger.info(`POST ${API_URLS.createTokens} - create tokens`);

      const { userId } = req.body;

      const tokens = await this.tokenGenerationService.createTokens(userId);

      res.json(tokens);
    });
  }

  registerRoutes() {
    this.createTokens();
  }
}
