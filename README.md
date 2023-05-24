<h1 align="center">Nest.js Google Cloud Storage</h1>

<h3 align="center">Allows you to save and download files to and from GCC storage</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Why?

When debugging an issue in your applications logs, it helps to be able to follow a specific request up and down your whole stack. This is usually done by including a `correlation-id` (aka `Request-id`) header in all your requests, and forwarding the same id across all your microservices.

### Installation

```bash
yarn add @evanion/nestjs-gcc-storage
```

```bash
npm install @evanion/nestjs-gcc-storage
```

### How to use

Add the middleware to your `AppModule`

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StorageModule } from '@evanion/nestjs-gcc-storage';

@Module({
  imports: [
    StorageModule.forRoot({
      isGlobal: true,
      projectId: string,
      bucket: string,
      credentials: {
        client_email: string,
        private_key: string,
      },
    }),
  ],
})
export class AppModule {}
```

_You can also use `forRootAsync` in order to use dynamic values. Useful to load values from `ConfigService`_

```ts
@Module({
  imports: [
    StorageModule,
  ] /* imports: [StorageModule.forFeature({bucket: 'user-bucket'})], // not currenly working */,
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

You can now use the `StorageService` in your application

```ts
import { Injectable } from '@nestjs/common';
import { StorageService } from '@evanion/nestjs-gcc-storage';
import { SetMetadataResponse } from '@google-cloud/storage/build/src/nodejs-common';

@Injectable()
export class UsersService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(file: Express.Multer.File): Observable<SetMetadataResult> {
    const { originalname, buffer } = file;
    const path = originalname.replace(/ /g, '_');
    const metadata = [];

    return this.storageService.save(path, buffer, metadata);
  }

  async downloadFile(filename: string): Observable<StorageFile> {
    return this.storageService.get(filename);
  }
}
```

###

see [e2e tests](/test) for a fully working example

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Mikael Pettersson (Evanion on [Discord](https://discord.gg/G7Qnnhy))**

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
