import { Application } from 'express';
import { ServerSentEventsController } from './serverSentEvents.controller.js';
import { ServerSentEventsService } from './serverSentEvents.service.js';

export function attachServerSentEventModule(app: Application) {
  const service = new ServerSentEventsService();
  const controller = new ServerSentEventsController(app, service);

  service.runSimulation();

  controller.attachRoutes();
}
