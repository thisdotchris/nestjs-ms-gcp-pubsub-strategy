import { NestFactory } from '@nestjs/core';
import { AnotherServiceModule } from './another-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AnotherServiceModule);
  await app.listen(3000);
}
bootstrap();
