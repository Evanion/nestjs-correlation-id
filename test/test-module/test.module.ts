import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { withCorrelation } from 'src';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [HttpModule.registerAsync(withCorrelation())],
})
export class TestModule {}
