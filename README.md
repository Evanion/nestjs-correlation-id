<h1 align="center">Nest.js Correlation ID middleware</h1>

<h3 align="center">Transparently include correlation IDs in all requests</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Why?

When debugging an issue in your applications logs, it helps to be able to follow a specific request up and down your whole stack. This is usually done by including a `correlation-id` (aka `Request-id`) header in all your requests, and forwarding the same id across all your microservices.

### Installation

```bash
yarn add @evanion/nestjs-correlation-id
```

```bash
npm install @evanion/nestjs-correlation-id
```

### How to use

Add the middleware to your `AppModule`

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CorrelationIdMiddleware,
  CorrelationModule,
} from '@evanion/nestjs-correlation-id';

@Module({
  imports: [CorrelationModule.forRoot()],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

And then just inject the correlation middleware in your HttpService by calling the `registerAsync` method with the `withCorrelation` function.

```ts
import { HttpModule } from '@nestjs/axios';
import { withCorrelation } from '@evanion/nestjs-correlation-id';

@Module({
  imports: [HttpModule.registerAsync(withCorrelation())],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

You can now use the `HttpService` as usual in your `UsersService` and `UsersController`

### Customize

You can easily customize the header and ID by including a config when you register the module

```ts
@Module({
  imports: [CorrelationModule.forRoot({
    header: string
    generator: () => string
  })]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

#### Add `correlationId` to logs

In order to add the correlation ID to your logs, you can use the `CorrelationService` service to get the current correlationId.

In the following example, we are using the [@ntegral/nestjs-sentry](https://github.com/ntegral/nestjs-sentry) package, but you can use any package or provider you like.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  constructor(
    private readonly correlationService: CorrelationService,
    @InjectSentry() private readonly sentryService: SentryService,
  ) {}

  async use(req: Request, res: Response, next) {
    const correlationId = await this.correlationService.getCorrelationId();
    this.sentryService.configureScope((scope) => {
      scope.setTag('correlationId', correlationId);
    });
    next();
  }
}
```

Then add it to your `AppModule`

```ts
import { Module } from '@nestjs-common';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { CorrelationModule } from '@evanion/nestjs-correlation-id';
import { SentryMiddleware } from './middleware/sentry.middleware';

@Module({
  imports: [
    CorrelationModule.forRoot(),
    SentryModule.forRoot({
      // ... your config
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(SentryMiddleware).forRoutes('*');
  }
}
```

If you need to manually set the correlationId anywhere in your application. You can use the `CorrelationService` service to set the correlationId.

```ts
this.correlationService.setCorrelationId('some_correlation_id');
```

see [e2e tests](/test) for a fully working example

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Mikael Pettersson (Evanion on [Discord](https://discord.gg/G7Qnnhy))**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
