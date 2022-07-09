import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CORRELATION_CONFIG_TOKEN } from './constants';
import { CorrelationService } from './correlation.service';
import { CorrelationConfig } from './interfaces/correlation-config.interface';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(
    private correlationService: CorrelationService,
    @Inject(CORRELATION_CONFIG_TOKEN)
    private correlationConfig: CorrelationConfig,
  ) {}
  use(req: Request, res: Response, next: () => void) {
    const { header } = this.correlationConfig;
    const correlationId =
      req.get(header) || this.correlationService.getCorrelationId();

    if (!req.headers[header]) req.headers[header] = correlationId;
    if (!res.get(header)) res.set(header, correlationId);

    this.correlationService.setCorrelationId(correlationId);
    next();
  }
}
