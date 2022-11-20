import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GCPPubSubServer } from '@lib/gcp-pubsub-strategy';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: new GCPPubSubServer({
      projectId: process.env.PROJECT_ID,
      subscription: process.env.TOPIC_SUB,
      topic: process.env.TOPIC
    })
  });
  await app.listen();
}
bootstrap();
