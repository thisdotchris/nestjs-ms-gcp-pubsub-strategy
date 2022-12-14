import { Message } from '@google-cloud/pubsub';
import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

const logger = new Logger();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('event-send-push')
  async sendPushEvent(@Payload() payload: Message) {
    logger.log(`@EventPattern('event-send-push'): ${payload.data}`);
    payload.ack();
  }

  @MessagePattern('event-send-push-res')
  async sendPushEventRes(@Payload() payload: Message) {
    logger.log(`@MessagePattern('event-send-push-res'): ${payload.data}`);
    payload.ack();
    return {
      error: null,
      status: 200,
      body: 'sample response'
    };
  }
}
