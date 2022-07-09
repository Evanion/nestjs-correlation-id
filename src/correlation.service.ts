import { Inject, Injectable, Scope } from '@nestjs/common';
import { v4 as UUIDv4 } from 'uuid';
import { CORRELATION_CONFIG_TOKEN } from './constants';
import { CorrelationConfig } from './interfaces/correlation-config.interface';

@Injectable({ scope: Scope.REQUEST })
export class CorrelationService {
  private correlationId: string;

  constructor(
    @Inject(CORRELATION_CONFIG_TOKEN) correlationConfig: CorrelationConfig,
  ) {
    this.correlationId = correlationConfig.generator
      ? correlationConfig.generator()
      : UUIDv4();
  }

  getCorrelationId(): string {
    return this.correlationId;
  }
  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }
}
