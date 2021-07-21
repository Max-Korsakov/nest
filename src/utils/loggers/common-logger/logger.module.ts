import { Module } from '@nestjs/common';
import CustomLogger from './logger.servece';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
