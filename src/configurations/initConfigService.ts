import type { Config } from './constants';
import { ConfigService } from '../lib/config-service';

export let configService: ConfigService<Config>;

export function initConfigService(initialConfig: Config) {
  configService = new ConfigService(initialConfig);

  return configService;
}
