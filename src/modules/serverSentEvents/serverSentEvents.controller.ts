import { Application } from 'express';
import { ServerSentEventsService } from './serverSentEvents.service';
import { createEventMessage } from './utils/createEventMessage';

export class ServerSentEventsController {
  app: Application;
  serverSentEventsService: ServerSentEventsService;

  constructor(app: Application, serverSentEventsService: ServerSentEventsService) {
    this.app = app;
    this.serverSentEventsService = serverSentEventsService;
  }

  connectToChannel() {
    this.app.get('/sse', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');

      this.serverSentEventsService.addClient(res);

      const message = createEventMessage({ content: 'Connection was successful!', eventName: 'connect' });

      res.write(message);
      res.flush();

      req.on('close', () => {
        this.serverSentEventsService.removeClient(res);

        res.end();
      });
    });
  }

  attachRoutes() {
    this.connectToChannel();
  }
}
