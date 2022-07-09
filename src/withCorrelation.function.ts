import { HttpModuleOptions } from '@nestjs/axios';
import { CORRELATION_ID_HEADER } from './constants';
import { CorrelationModule } from './correlation.module';
import { CorrelationService } from './correlation.service';

export const withCorrelation = (config?: HttpModuleOptions) => ({
  imports: [CorrelationModule],
  useFactory: async (correlationService: CorrelationService) => ({
    ...config,
    headers: {
      ...(config?.headers && config.headers),
      [CORRELATION_ID_HEADER]: correlationService.getCorrelationId(),
    },
  }),
  inject: [CorrelationService],
});
