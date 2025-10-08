import { Application } from 'express';
import { ControllerFactory } from '../../../lib/lucky-server';
import { ServerSentEventsService } from '../services/serverSentEvents.service';
import { createEventMessage } from '../utils/createEventMessage';

export class ServerSentEventsController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly serverSentEventsService: ServerSentEventsService,
  ) {}

  private connectToChannel() {
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
