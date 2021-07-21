import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import CustomLogger from './utils/loggers/common-logger/logger.servece';
import { AppModule } from './app.module';

const logger = new CustomLogger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Nest CRUD application')
    .setDescription('Node Js mentoring program')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  app.useLogger(app.get(CustomLogger));

  process
    .on('unhandledRejection', (error, p) => {
      logger.log(`Unhandled Rejection ${error}, stack trace ${p}`);
    })
    .on('uncaughtException', (error) => {
      logger.log(`Uncaught Exception ${error}`);
      process.exit(1);
    });
  await app.listen(3000);
}
bootstrap();
