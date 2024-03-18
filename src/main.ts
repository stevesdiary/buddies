if (!process.env.IS_TS_NODE) {
  require('module-alias/register'); //this means when we are in production mode and not development mode, this module alias will not be required
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
