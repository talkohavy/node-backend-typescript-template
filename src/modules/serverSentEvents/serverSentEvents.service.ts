import redis, { RedisClientType } from 'redis';
import { createEventMessage } from './utils/createEventMessage.js';

const { createClient } = redis;

export class ServerSentEventsService {
  redisSubscriber: RedisClientType;

  clients: Array<any>;

  constructor() {
    this.redisSubscriber = createClient({ url: 'redis://localhost:6379' });
    this.redisSubscriber.connect();
    this.clients = [];

    this.redisSubscriber.subscribe('sse-events', (content) => {
      console.log('Received event:', content);

      this.clients.forEach((client) => {
        const message = createEventMessage({ content, eventName: 'my-data' });
        client.write(message);
      });
    });
  }

  addClient(client: any) {
    this.clients.push(client);
  }

  removeClient(res: any) {
    this.clients.splice(this.clients.indexOf(res), 1);
  }

  // ##########################################
  redisPublisher = {} as RedisClientType;

  runSimulation() {
    this.redisPublisher = createClient({ url: 'redis://localhost:6379' });
    this.redisPublisher.connect();
    // ############################

    setInterval(() => {
      const eventData = { time: new Date().toISOString() };

      this.broadcastEvent(eventData);
    }, 5000);
  }

  async broadcastEvent(data: any) {
    return this.redisPublisher.publish('sse-events', JSON.stringify(data));
  }
}
