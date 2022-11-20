import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AnotherServiceService {
  constructor(
    @Inject('MY_CLIENT') private readonly client: ClientProxy
  ) { }

  getHello(): string {

    this.client.emit('event-send-push', { message: 'message from another service' });

    return 'Hello World!';
  }
}
