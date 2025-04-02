import { Application } from 'express';
import { ServerSentEventsService } from './serverSentEvents.service.js';
import { createEventMessage } from './utils/createEventMessage.js';

export class ServerSentEventsController {
  app: Application;
  serverSentEventsService: ServerSentEventsService;

  constructor(app: Application, serverSentEventsService: ServerSentEventsService) {
    this.app = app;
    this.serverSentEventsService = serverSentEventsService;
  }

  get() {
    this.app.get('/sse', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

      this.serverSentEventsService.addClient(res);

      res.writeHead(200, { 'Content-Type': 'text/event-stream' });

      req.on('close', () => {
        this.serverSentEventsService.removeClient(res);

        res.end();
      });

      const message = createEventMessage({ content: 'Connection was successful!', eventName: 'connect' });

      res.write(message);
    });
  }
}
