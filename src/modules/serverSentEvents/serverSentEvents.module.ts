import type { Application } from 'express';
import { ServerSentEventsController } from './controllers/serverSentEvents.controller';
import { ServerSentEventsService } from './services/serverSentEvents.service';

export class ServerSentEventModule {
  private serverSentEventsService!: ServerSentEventsService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.serverSentEventsService = new ServerSentEventsService(this.app.logger);

    // SSE always attaches routes directly - clients connect to this endpoint
    // without going through the BFF (persistent connections don't proxy well)
    this.attachRoutes(this.app);
  }

  private attachRoutes(app: Application): void {
    const controller = new ServerSentEventsController(app, this.serverSentEventsService);

    controller.registerRoutes();
  }
}
