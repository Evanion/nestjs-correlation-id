import { DynamicModule, Module, Provider } from '@nestjs/common';
import { v4 as UUIDv4 } from 'uuid';
import { CORRELATION_CONFIG_TOKEN, CORRELATION_ID_HEADER } from './constants';
import { CorrelationService } from './correlation.service';
import { CorrelationConfig } from './interfaces/correlation-config.interface';

@Module({})
export class CorrelationModule {
  static forRoot(config?: Partial<CorrelationConfig>): DynamicModule {
    const correlationConfigProvider: Provider = {
      provide: CORRELATION_CONFIG_TOKEN,
      useValue: {
        ...config,
        header: config?.header || CORRELATION_ID_HEADER,
        generator: config?.generator || UUIDv4,
      },
    };
    return {
      global: true,
      module: CorrelationModule,
      providers: [correlationConfigProvider, CorrelationService],
      exports: [correlationConfigProvider, CorrelationService],
    };
  }
}
