import { performance } from 'perf_hooks';

import CustomLogger from '../common-logger/logger.servece';

const logger = new CustomLogger('Time logger');

export const methodExecutionTimeLogger = (func: any) => async (
  context,
  ...args
) => {
  let start;
  try {
    start = performance.now();
    const result = await func.call(context, ...args);
    const end = performance.now();
    logger.log(`${func.name} take ${end - start} ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    logger.log(`${func.name} take ${end - start} ms`);
    return error;
  }
};
