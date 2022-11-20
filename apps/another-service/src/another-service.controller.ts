import { Controller, Get } from '@nestjs/common';
import { AnotherServiceService } from './another-service.service';

@Controller()
export class AnotherServiceController {
  constructor(private readonly anotherServiceService: AnotherServiceService) {}

  @Get()
  getHello(): string {
    return this.anotherServiceService.getHello();
  }
}
