/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
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
  beforeEach(() => {
    middleware = new CorrelationIdMiddleware(
      mockCorrelationService,
      mockCorrelationConfig,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should set the correlation id in request object', () => {
    const req = {
      get: jest.fn(),
      headers: {},
    };
    const res = {
      get: jest.fn(),
      set: jest.fn(),
      headers: {},
    };
    jest.spyOn(res, 'set');
    middleware.use(req as any, res as any, jest.fn());

    expect(req.headers['x-correlation-id']).toBe('test123');
  });

  it('should set the correlation id in response object', () => {
    const req = {
      get: jest.fn().mockImplementation(() => 'test123'),
      headers: {},
    };
    const res = {
      get: jest.fn(),
      set: jest.fn(),
      headers: {},
    };
    jest.spyOn(res, 'set');
    middleware.use(req as any, res as any, () => {});

    expect(res.set).toHaveBeenCalledWith('x-correlation-id', 'test123');
  });

  it('should set the correlation id in correlationService', () => {
    const req = {
      get: jest.fn().mockImplementation(() => 'test123'),
      headers: {},
    };
    const res = {
      get: jest.fn(),
      set: jest.fn(),
      headers: {},
    };
    jest.spyOn(res, 'set');
    middleware.use(req as any, res as any, jest.fn());

    expect(mockCorrelationService.setCorrelationId).toHaveBeenCalledWith(
      'test123',
    );
  });
});
