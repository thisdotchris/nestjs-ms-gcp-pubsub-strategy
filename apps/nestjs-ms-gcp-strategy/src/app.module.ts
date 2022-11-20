import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GCPModule } from '@lib/gcp-pubsub-strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GCPModule.register([{
      projectId: process.env.PROJECT_ID,
      topic: process.env.TOPIC,
      name: 'my-pubsub'
    }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
