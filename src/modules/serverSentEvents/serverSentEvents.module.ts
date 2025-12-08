import type { Application } from 'express';
import { ServerSentEventsController } from './controllers/serverSentEvents.controller';
import { ServerSentEventsService } from './services/serverSentEvents.service';

export class ServerSentEventModule {
  private static instance: ServerSentEventModule;
  private serverSentEventsService!: ServerSentEventsService;

  static getInstance(app?: any): ServerSentEventModule {
    if (!ServerSentEventModule.instance) {
      ServerSentEventModule.instance = new ServerSentEventModule(app);
    }
    return ServerSentEventModule.instance;
  }

  private constructor(private readonly app: any) {
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
