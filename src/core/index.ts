// singleton services initializer
export { initGlobalServices } from './initGlobalServices';

// connections initializer
export { initConnections } from './initConnections';

// Module & Middleware registries
export { MiddlewareRegistry } from './middlewareRegistry';

// initialized global singleton services
export { callContextService } from './initGlobalServices/initCallContextService';
export { logger } from './initGlobalServices/initLoggerService';
export { configService } from './initGlobalServices/initConfigService';

// initialized global connections
export { redisPubConnection } from './initConnections/initRedisConnection';
export { redisSubConnection } from './initConnections/initRedisConnection';
