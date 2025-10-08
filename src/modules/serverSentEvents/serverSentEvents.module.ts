import type { Application } from 'express';
import type { ModuleFactory } from '../../lib/lucky-server';
import { ServerSentEventsController } from './controllers/serverSentEvents.controller';
import { ServerSentEventsService } from './services/serverSentEvents.service';

export class ServerSentEventModule implements ModuleFactory {
  private static instance: ServerSentEventModule;
  private serverSentEventsService!: ServerSentEventsService;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): ServerSentEventModule {
    if (!ServerSentEventModule.instance) {
      ServerSentEventModule.instance = new ServerSentEventModule();
    }
    return ServerSentEventModule.instance;
  }

  protected initializeModule(): void {
    this.serverSentEventsService = new ServerSentEventsService();
  }

  attachController(app: Application): void {
    const controller = new ServerSentEventsController(app, this.serverSentEventsService);

    controller.attachRoutes();
  }
}
