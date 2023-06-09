import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  ping() {
    return 'pong';
  }

  @Get('/test')
  test() {
    return this.testService.getFile();
  }
}
