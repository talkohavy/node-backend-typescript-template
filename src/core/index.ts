// singleton services initializer
export { initGlobalServices } from './initGlobalServices';

// connections initializer
export { initConnections } from './initConnections';

// initialized global singleton services
export { callContextService } from './initGlobalServices/initCallContextService';
export { configService } from './initGlobalServices/initConfigService';

// initialized global connections
export { redisPubConnection } from './initConnections/initRedisConnection';
export { redisSubConnection } from './initConnections/initRedisConnection';
