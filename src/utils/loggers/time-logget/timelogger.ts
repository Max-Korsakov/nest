import { performance } from 'perf_hooks';

import CustomLogger from '../common-logger/logger.servece';

const logger = new CustomLogger('Time logger');

export function LogDecorator() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let originalFunc: Function;
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    originalFunc = descriptor.value;
    descriptor.value = async function (...args) {
      let start;
      try {
        start = performance.now();
        const result = await originalFunc.apply(this, args);
        const end = performance.now();
        logger.log(
          `Log from decorator ${originalFunc.name} take ${end - start} ms`,
        );
        return result;
      } catch (error) {
        const end = performance.now();
        logger.log(
          `Log from decorator error ${originalFunc.name} take ${
            end - start
          } ms`,
        );
        return error;
      }
    };
  };
}
