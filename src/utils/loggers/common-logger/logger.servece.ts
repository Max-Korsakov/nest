import { LoggerService } from '@nestjs/common';
import winston from 'winston';
import path from 'path';

export default class CustomLogger implements LoggerService {
  private logger;

  constructor(serviceName) {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      defaultMeta: { service: serviceName || 'Application level' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: `${path.resolve()}/logs/error.log`,
          level: 'error',
        }),
        new winston.transports.File({
          filename: `${path.resolve()}/logs/combined.log`,
          level: 'info',
        }),
      ],
    });
  }
  log(message: string) {
    this.logger.log({ message, level: 'info' });
  }
  error(message: string, trace?: string) {
    trace ? console.log(trace) : null;
    this.logger.error({ message, level: 'error' });
  }
  warn(message: string) {
    this.logger.warn({ message, level: 'warn' });
  }
  debug(message: string) {
    this.logger.debug({ message, level: 'debug' });
  }
  verbose(message: string) {
    this.logger.verbose({ message, level: 'verbose' });
  }
}
