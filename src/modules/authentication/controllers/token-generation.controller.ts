import { Application, Request, Response } from 'express';
import { logger } from '../../../core';
import { ControllerFactory } from '../../../lib/lucky-server';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { TokenGenerationService } from '../services/token-generation.service';
import { createTokensSchema } from './dto/create-tokens.dto';

export class TokenGenerationController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  private createTokens() {
    this.app.post('/auth/tokens', joiBodyMiddleware(createTokensSchema), async (req: Request, res: Response) => {
      logger.info('POST /auth/tokens - create tokens');

      const { userId } = req.body;

      const tokens = await this.tokenGenerationService.createTokens(userId);

      res.json(tokens);
    });
  }

  attachRoutes() {
    this.createTokens();
  }
}
