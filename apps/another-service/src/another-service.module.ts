import { GCPModule } from '@lib/gcp-pubsub-strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnotherServiceController } from './another-service.controller';
import { AnotherServiceService } from './another-service.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GCPModule.register(
      [
        {
          name: 'MY_CLIENT',
          projectId: process.env.PROJECT_ID,
          topic: process.env.TOPIC,
          responseTopic: process.env.RESPONSE_TOPIC
        }
      ]
    )
  ],
  controllers: [AnotherServiceController],
  providers: [AnotherServiceService],
})
export class AnotherServiceModule { }
