import { Module } from '@nestjs/common';
import { StorageModule } from '../../src';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    StorageModule.forRoot({
      isGlobal: true,
      projectId: 'test-project-id',
      bucket: 'test-bucket',
      credentials: {
        client_email: 'test-client-email',
        private_key: 'test-private-key',
      },
    }),
  ],
})
export class TestModule {}
