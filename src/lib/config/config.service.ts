export class ConfigService {
  private readonly config: Record<string, any>;

  constructor(initialConfig: Record<string, any> = {}) {
    this.config = initialConfig;
  }

  get<T = any>(key: string): T {
    return this.config[key];
  }

  set(key: string, value: any): void {
    this.config[key] = value;
  }

  getAll(): Record<string, any> {
    return this.config;
  }
}

export let configService: ConfigService;

export function initConfigService() {
  const initialConfig = {
    cookieNames: {
      accessTokenCookieName: 'access_token',
    },
    logSettings: {
      logLevel: 'info',
      logEnvironment: 'development',
    },
  };

  configService = new ConfigService(initialConfig);

  return configService;
}
