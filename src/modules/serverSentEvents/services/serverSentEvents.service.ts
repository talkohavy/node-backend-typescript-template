import { RedisClientType } from 'redis';
import { logger, redisPubConnection, redisSubConnection } from '../../../core';
import { createEventMessage } from '../utils/createEventMessage';

export class ServerSentEventsService {
  private readonly redisPubClient: RedisClientType;
  private readonly redisSubClient: RedisClientType;
  private readonly clients: Array<any> = [];

  constructor() {
    redisPubConnection.ensureConnected();
    redisSubConnection.ensureConnected();

    this.redisPubClient = redisPubConnection.getClient()!;
    this.redisSubClient = redisSubConnection.getClient()!;

    this.redisSubClient.subscribe('sse-events', (content) => {
      logger.log('Received event:', content);

      this.clients.forEach((client) => {
        const message = createEventMessage({ content, eventName: 'luckylove-data' });
        client.write(message);
        client.flush();
      });
    });
  }

  addClient(client: any) {
    logger.log('socket joined!');
    this.clients.push(client);
  }

  removeClient(res: any) {
    logger.log('socket left.');
    this.clients.splice(this.clients.indexOf(res), 1);
  }

  runSimulation() {
    setInterval(() => {
      const eventData = { time: new Date().toISOString() };

      this.broadcastEvent(eventData);
    }, 5000);
  }

  async broadcastEvent(data: any) {
    const messageContent = JSON.stringify(data);
    const result = await this.redisPubClient.publish('sse-events', messageContent);
    return result;
  }
}
