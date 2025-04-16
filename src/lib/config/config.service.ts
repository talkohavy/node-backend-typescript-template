import { Config } from '../../configurations/types.js';

export class ConfigService<T = Record<string, any>> {
  private readonly config: T;

  constructor(initialConfig: T = {} as T) {
    this.config = initialConfig;
  }

  get<K = any>(key: string): K {
    return this.config[key as keyof T] as K;
  }

  set(key: string, value: any): void {
    this.config[key as keyof T] = value;
  }

  getAll(): T {
    return this.config;
  }
}

export let configService: ConfigService;

export function initConfigService(initialConfig: Config) {
  configService = new ConfigService(initialConfig);

  return configService;
}
