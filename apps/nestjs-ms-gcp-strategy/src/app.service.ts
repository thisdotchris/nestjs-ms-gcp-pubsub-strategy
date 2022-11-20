import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('my-pubsub')
    private readonly client: ClientProxy
  ) { }

  getHello(): string {
    this.client.emit('event-send-push', { myMessage: 'emit from nest app' });
    return 'Hello World!';
  }
}
