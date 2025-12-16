import type { Application } from 'express';
import { IS_MICRO_SERVICES } from '../../common/constants';
import { ServerSentEventsController } from './controllers/serverSentEvents.controller';
import { ServerSentEventsService } from './services/serverSentEvents.service';

export class ServerSentEventModule {
  private serverSentEventsService!: ServerSentEventsService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.serverSentEventsService = new ServerSentEventsService(this.app.logger);

    if (IS_MICRO_SERVICES) {
      this.attachRoutes(this.app);
    }
  }

  private attachRoutes(app: Application): void {
    const controller = new ServerSentEventsController(app, this.serverSentEventsService);

    controller.registerRoutes();
  }
}
