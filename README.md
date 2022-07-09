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

see [e2e tests](/test) for a fully working example

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Mikael Pettersson (Evanion on [Discord](https://discord.gg/G7Qnnhy))**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
