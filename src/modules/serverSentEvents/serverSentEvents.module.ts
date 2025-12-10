import type { Application } from 'express';
import { ServerSentEventsController } from './controllers/serverSentEvents.controller';
import { ServerSentEventsService } from './services/serverSentEvents.service';

export class ServerSentEventModule {
  private serverSentEventsService!: ServerSentEventsService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.serverSentEventsService = new ServerSentEventsService();

    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const controller = new ServerSentEventsController(app, this.serverSentEventsService);

    controller.attachRoutes();
  }
}
