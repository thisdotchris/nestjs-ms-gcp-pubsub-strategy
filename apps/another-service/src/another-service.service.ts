import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AnotherServiceService {
  constructor(
    @Inject('MY_CLIENT') private readonly client: ClientProxy
  ) { }

  getHello(): string {

    this.client.emit('event-send-push', { message: 'via emit' });

    this.client.send('event-send-push-res', { message: 'via send' })
      .subscribe(res => console.log('res: ', res));

    return 'Hello World!';
  }
}
