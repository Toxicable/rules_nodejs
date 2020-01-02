import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';

import {AppModule} from './app.module';

async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  await app.listen(port);
  Logger.log(`Application served at http://localhost:${port}`);
}

if (require.main === module) {
  const argv = require('minimist')(process.argv.slice(2));
  bootstrap(argv.port || 3000);
}
