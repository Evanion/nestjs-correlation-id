import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { CorrelationService } from './correlation.service';
import { CorrelationConfig } from './interfaces/correlation-config.interface';

const mockCorrelationConfig: CorrelationConfig = {
  header: 'x-correlation-id',
  generator: () => '12345',
};

// @ts-expect-error: Test mock
const mockCorrelationService: CorrelationService = {
  getCorrelationId: jest.fn().mockImplementation(() => 'test123'),
  setCorrelationId: jest.fn(),
};

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  beforeEach(() => {});

  it('should be defined', () => {
    expect(
      new CorrelationIdMiddleware(
        mockCorrelationService,
        mockCorrelationConfig,
      ),
    ).toBeDefined();
  });

  it('should set the correlation id in request object', () => {
    const middleware = new CorrelationIdMiddleware(
      mockCorrelationService,
      mockCorrelationConfig,
    );
    const req = {
      get: jest.fn().mockImplementation(() => ''),
      headers: {},
    };
    const res = {
      get: jest.fn().mockImplementation(() => ''),
      set: jest.fn().mockImplementation((key: string, value: string) => {}),
      headers: {},
    };
    jest.spyOn(res, 'set');
    middleware.use(req as any, res as any, () => {});

    expect(req.headers['x-correlation-id']).toBe('test123');
  });

  it('should set the correlation id in response object', () => {
    const middleware = new CorrelationIdMiddleware(
      mockCorrelationService,
      mockCorrelationConfig,
    );
    const req = {
      get: jest.fn().mockImplementation(() => 'test123'),
      headers: {},
    };
    const res = {
      get: jest.fn().mockImplementation(() => ''),
      set: jest.fn().mockImplementation((key: string, value: string) => {}),
      headers: {},
    };
    jest.spyOn(res, 'set');
    middleware.use(req as any, res as any, () => {});

    expect(res.set).toHaveBeenCalledWith('x-correlation-id', 'test123');
  });

  it('should set the correlation id in correlationService', () => {
    const middleware = new CorrelationIdMiddleware(
      mockCorrelationService,
      mockCorrelationConfig,
    );
    const req = {
      get: jest.fn().mockImplementation(() => 'test123'),
      headers: {},
    };
    const res = {
      get: jest.fn().mockImplementation(() => ''),
      set: jest.fn().mockImplementation((key: string, value: string) => {}),
      headers: {},
    };
    jest.spyOn(res, 'set');
    middleware.use(req as any, res as any, () => {});

    expect(mockCorrelationService.setCorrelationId).toHaveBeenCalledWith(
      'test123',
    );
  });
});
