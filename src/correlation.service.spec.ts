import { Test, TestingModule } from '@nestjs/testing';
import { CORRELATION_CONFIG_TOKEN, CORRELATION_ID_HEADER } from './constants';
import { CorrelationService } from './correlation.service';

describe('CorrelationService', () => {
  let service: CorrelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorrelationService,
        {
          provide: CORRELATION_CONFIG_TOKEN,
          useValue: {
            header: CORRELATION_ID_HEADER,
            generator: () => 'test-id',
          },
        },
      ],
    }).compile();

    service = await module.resolve<CorrelationService>(CorrelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
