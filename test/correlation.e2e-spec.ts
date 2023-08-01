import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import * as request from 'supertest';
import { CorrelationIdMiddleware, CorrelationModule } from '../src';
import { TestModule } from './test-module/test.module';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosRequestHeaders } from 'axios';

@Module({
  imports: [CorrelationModule.forRoot(), TestModule],
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

describe('CorrelationMiddleware (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    httpService = moduleFixture.get<HttpService>(HttpService);

    app = moduleFixture.createNestApplication();

    await app.init();

    jest.spyOn(httpService, 'get').mockImplementation(() =>
      of({
        config: { url: 'http://example.com/test', method: 'GET', headers: {} as AxiosRequestHeaders },
        headers: {
          connection: 'keep-alive',
          'content-type': 'application/json',
        },
        status: HttpStatus.OK,
        statusText: 'OK',
        data: { foo: 'bar' },
      }),
    );
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('pong');
  });

  it('/ (GET) with correlation id', async () => {
    const result = await request(app.getHttpServer())
      .get('/')
      .set('X-Correlation-Id', 'test-id-1');

    expect(result.headers['x-correlation-id']).toBe('test-id-1');
  });
});
